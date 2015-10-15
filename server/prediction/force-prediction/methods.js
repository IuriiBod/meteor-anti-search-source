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

  }
});