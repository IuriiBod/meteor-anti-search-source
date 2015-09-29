var currentLocationId = 1;

var updateLastTaskRunDateForLocation = function (locationId) {
  //update task run date
  ForecastDates.update({locationId: locationId}, {
    $set: {
      lastUploadDate: new Date(),
      locationId: locationId
    }
  }, {upsert: true});
};

var createUpdateActualSalesFunction = function () {
  //updates sales data for previous day
  var isHandledFirstDay = false;
  var previousDayMoment = moment().subtract(1, 'day');

  return function (salesData) {
    if (!isHandledFirstDay && previousDayMoment.isSame(salesData.createdDate, 'day')) {
      //todo save sales data here
      console.log('data to update ', salesData);
      isHandledFirstDay = false;
      return false;
    }
    return true;
  };
};


SyncedCron.add({
  name: 'Prediction model refresh',
  schedule: function (parser) {
    return parser.text('at 03:00 am');
  },
  job: function () {
    //todo: update it for all locations
    var forecastData = ForecastDates.findOne({locationId: currentLocationId});

    var needToUpdateModel = !forecastData || !forecastData.lastUploadDate || forecastData.lastUploadDate >= getMillisecondsFromDays(182);

    var updateActualSalesFn = createUpdateActualSalesFunction()

    if (needToUpdateModel) {
      if (!HospoHero.isDevelopmentMode()) {
        //todo: update it for organizations
        var predictionApi = new GooglePredictionApi();
        var updateSession = predictionApi.getUpdatePredictionModelSession();

        //upload sales training data for the last year
        Revel.uploadAndReduceOrderItems(function (salesData) {
          updateActualSalesFn(salesData);
          return updateSession.onDataReceived(salesData);
        });

        updateSession.onUploadingFinished();

        updateLastTaskRunDateForLocation(currentLocationId)
      }


    } else {
      //update sales for last day only
      Revel.uploadAndReduceOrderItems(function (salesData) {
        return updateActualSalesFn(salesData);
      });
    }
  }
});


