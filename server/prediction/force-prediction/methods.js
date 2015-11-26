var checkOrganizationOwner = function (userId) {
  if (!HospoHero.isOrganizationOwner(userId)) {
    throw new Meteor.Error(403, 'You have no power here!');
  }
};


Meteor.methods({
  updatePredictionModel: function () {
    checkOrganizationOwner(this.userId);
    try {
      var locations = Locations.find({archived: {$ne: true}});
      locations.forEach(updateTrainingDataForLocation);
    } catch (err) {
      logger.error(err);
      return false;
    }
    return true;
  },

  updatePredictions: function () {
    checkOrganizationOwner(this.userId);
    try {
      logger.info('started prediction update job');
      var locations = Locations.find({archived: {$ne: true}});
      locations.forEach(updateForecastForLocation);
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
    DailySales.update({}, {$unset: {predictionQuantity: '', predictionUpdatedAt: ''}}, {multi: true});
    Locations.update({}, {$unset: {lastForecastModelUploadDate: ''}}, {multi: true});
  }
});