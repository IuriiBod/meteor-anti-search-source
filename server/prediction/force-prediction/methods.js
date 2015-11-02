var checkOrganizationOwner = function (userId) {
  if (!HospoHero.isOrganizationOwner(userId)) {
    throw new Meteor.Error(403, 'You have no power here!');
  }
};

Meteor.methods({
  updatePredictions: function () {
    checkOrganizationOwner(this.userId);
    try {
      salesPredictionUpdateJob();
    } catch (err) {
      logger.error(err);
      return false;
    }
    return true;
  },

  updatePredictionModel: function () {
    checkOrganizationOwner(this.userId);
    predictionModelRefreshJob();
    return true;
  },

  getPredictionModelStatus: function () {
    checkOrganizationOwner(this.userId);
    var currentArea = HospoHero.getCurrentArea(this.userId);
    var googlePredictionApi = new GooglePredictionApi(currentArea.locationId);
    return googlePredictionApi.getModelStatus();
  }
});