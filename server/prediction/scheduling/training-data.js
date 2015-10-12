var updateLastTaskRunDateForLocation = function (locationId) {
  //update task run date
  ForecastDates.update({locationId: locationId}, {
    $set: {
      lastUploadDate: new Date(),
      locationId: locationId
    }
  }, {upsert: true});
};


var createUpdateActualSalesFunction = function (locationId) {
  //updates sales data for previous day
  var isHandledFirstDay = false;
  var previousDayMoment = moment().subtract(1, 'day');

  return function (salesData) {
    if (!isHandledFirstDay && previousDayMoment.isSame(salesData.createdDate, 'day')) {
      Object.keys(salesData.menuItems).forEach(function (menuItemName) {
        var menuItem = HospoHero.predictionUtils.getMenuItemByRevelName(menuItemName, locationId);
        if (menuItem) {
          var item = {
            quantity: salesData.menuItems[menuItemName],
            date: salesData.createdDate,
            menuItemId: menuItem._id,
            relations: menuItem.relations
          };
          ImportedActualSales.update(
            {date: TimeRangeQueryBuilder.forDay(item.date), menuItemId: item.menuItemId},
            item,
            {upsert: true}
          );
        }
      });

      isHandledFirstDay = false;
      return false;
    }
    return true;
  };
};

predictionModelRefreshJob = function () {

  var locations = Locations.find({}).fetch();

  _.each(locations, function (location) {
    if (HospoHero.predictionUtils.havePos(location)) {
      var forecastData = ForecastDates.findOne({locationId: location._id});
      var needToUpdateModel = !forecastData || !forecastData.lastUploadDate
        || forecastData.lastUploadDate >= HospoHero.getMillisecondsFromDays(182);

      var updateActualSalesFn = createUpdateActualSalesFunction(location._id);

      if (needToUpdateModel) {
        var predictionApi = new GooglePredictionApi();
        var updateSession = predictionApi.getUpdatePredictionModelSession(location._id);

        //upload sales training data for the last year
        Revel.uploadAndReduceOrderItems(function (salesData) {
          updateActualSalesFn(salesData);
          return updateSession.onDataReceived(salesData);
        }, location.pos);

        updateSession.onUploadingFinished();

        updateLastTaskRunDateForLocation(location._id);
      } else {
        //update sales for last day only
        Revel.uploadAndReduceOrderItems(function (salesData) {
          return updateActualSalesFn(salesData);
        }, location.pos);
      }
    }
  });
};

SyncedCron.add({
  name: 'Prediction model refresh',
  schedule: function (parser) {
    return parser.text('at 03:00 am');
  },
  job: predictionModelRefreshJob
});

