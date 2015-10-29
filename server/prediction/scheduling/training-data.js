var updateActualSales = function (item) {
  DailySales.update({
    date: TimeRangeQueryBuilder.forDay(item.date),
    menuItemId: item.menuItemId
  }, {$set: item}, {upsert: true});
};


var createUpdateActualSalesFunction = function (locationId) {
  //updates sales data for previous day
  var isHandledFirstDay = false;
  var previousDayMoment = moment().subtract(1, 'day');

  return function (salesData) {
    if (!isHandledFirstDay && previousDayMoment.isSame(salesData.createdDate, 'day')) {
      Object.keys(salesData.menuItems).forEach(function (menuItemName) {
        var menuItem = HospoHero.prediction.getMenuItemByRevelName(menuItemName, locationId);

        if (menuItem) {
          var item = {
            actualQuantity: salesData.menuItems[menuItemName],
            date: salesData.createdDate,
            menuItemId: menuItem._id,
            relations: menuItem.relations
          };
          updateActualSales(item);
        }
      });

      isHandledFirstDay = false;
      return false;
    }
    return true;
  };
};


predictionModelRefreshJob = function () {
  var locations = Locations.find({archived: {$ne: true}});

  locations.forEach(function (location) {
    var predictionEnabled = HospoHero.prediction.isAvailableForLocation(location);

    if (predictionEnabled) {
      var lastForecastModelUploadDate = location.lastForecastModelUploadDate || false;

      var needToUpdateModel = !lastForecastModelUploadDate
          || moment(lastForecastModelUploadDate) < moment().subtract(182, 'day');

      var updateActualSalesFn = createUpdateActualSalesFunction(location._id);

      var revelClient = new Revel(location.pos);

      if (needToUpdateModel) {
        var predictionApi = new GooglePredictionApi(location._id);
        var updateSession = predictionApi.getUpdatePredictionModelSession(location._id);

        //upload sales training data for the last year
        revelClient.uploadAndReduceOrderItems(function (salesData) {
          updateActualSalesFn(salesData);
          return updateSession.onDataReceived(salesData);
        });

        updateSession.onUploadingFinished();

        Locations.update({_id: location._id}, {$set: {lastForecastModelUploadDate: new Date()}});
      } else {
        //update sales for last day only
        revelClient.uploadAndReduceOrderItems(function (salesData) {
          return updateActualSalesFn(salesData);
        });
      }
    }
  });
};

if (!HospoHero.isDevelopmentMode()) {
  SyncedCron.add({
    name: 'Prediction model refresh',
    schedule: function (parser) {
      return parser.text('at 03:00 am');
    },
    job: predictionModelRefreshJob
  });
}