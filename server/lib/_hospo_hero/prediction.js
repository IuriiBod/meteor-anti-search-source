Namespace('HospoHero.prediction', {
  getDateThreshold: function () {
    var predictionThresholdDate = Meteor.settings.prediction.threshold;
    return predictionThresholdDate && new Date(predictionThresholdDate) || new Date();
  }
});
