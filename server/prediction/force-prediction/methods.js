var checkOrganizationOwner = function (userId) {
  if (!HospoHero.isOrganizationOwner(userId)) {
    throw new Meteor.Error(403, 'You have no power here!');
  }
};

Meteor.methods({
  updatePredictionModel: function () {
    checkOrganizationOwner(this.userId);
    try {
      predictionModelRefreshJob();
    } catch (err) {
      logger.error(err);
      return false;
    }
    return true;
  },

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

  getPredictionModelStatus: function () {
    checkOrganizationOwner(this.userId);
    try {
      var currentArea = HospoHero.getCurrentArea(this.userId);
      var googlePredictionApi = new GooglePredictionApi(currentArea.locationId);
      return googlePredictionApi.getModelStatus();
    } catch (err) {
      logger.error(err);
      return false;
    }
  },

  resetForecastData: function () {
    DailySales.remove({});
    Locations.update({}, {$unset: {lastForecastModelUploadDate: ''}}, {multi: true});
    MenuItems.update({}, {$set: {isNotSyncedWithPos: false}}, {multi: true});
  }
});