currentLocationId = 1;

SyncedCron.add({
  name: 'Prediction model refresh',
  schedule: function (parser) {
    return parser.text('at 03:00 am');
  },
  job: function () {
    var predictionApi = new GooglePredictionApi();
    var forecastData = ForecastDates.findOne({locationId: currentLocationId});
    if (!forecastData){
      ForecastDates.insert({locationId: currentLocationId, lastUploadDate: moment().toDate()});
      predictionApi.updatePredictionModel();
    }else if(!forecastData.lastUploadDate || forecastData.lastUploadDate >= getMillisecondsFromDays(182)){
      ForecastDates.update({locationId: currentLocationId}, {$set:{lastUploadDate: moment().toDate()}});
      predictionApi.updatePredictionModel();
    }



    //if (!HospoHero.isDevelopmentMode()) {
    //  //todo: update it for organizations
    //  var predictionApi = new GooglePredictionApi();
    //  predictionApi.updatePredictionModel();
    //}
  }
});
