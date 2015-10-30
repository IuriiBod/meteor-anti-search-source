Meteor.methods({
  updatePredictions: function () {
    try {
      ForecastDates.remove({});
      salesPredictionUpdateJob();
    } catch (err) {
      logger.error(err);
      return false;
    }
    return true;
  },

  updatePredictionModel: function () {
    predictionModelRefreshJob();
    return true;
  },

  getPredictionModelStatus: function () {
    var currentArea = HospoHero.getCurrentArea(this.userId);
    var googlePredictionApi = new GooglePredictionApi(currentArea.locationId);
    return googlePredictionApi.getModelStatus();
  }
});