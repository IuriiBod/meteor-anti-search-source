SyncedCron.add({
  name: 'Prediction model refresh',
  schedule: function (parser) {
    return parser.text('every 6 month');
  },
  job: function () {
    if (!HospoHero.isDevelopmentMode()) {
      //todo: update it for organizations
      var predictionApi = new GooglePredictionApi();
      predictionApi.updatePredictionModel();
    }
  }
});
