Meteor.methods({
  updatePredictions: function () {
    salesPredictionUpdateJob();
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