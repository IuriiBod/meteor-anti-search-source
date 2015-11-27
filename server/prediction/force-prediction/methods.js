var checkOrganizationOwner = function (userId) {
  if (!HospoHero.isOrganizationOwner(userId)) {
    throw new Meteor.Error(403, 'You have no power here!');
  }
};


Meteor.methods({
  updatePredictionModel: function () {
    checkOrganizationOwner(this.userId);
    var locations = Locations.find({archived: {$ne: true}});
    locations.forEach(updateTrainingDataForLocation);
    return true;
  },

  updatePredictions: function () {
    checkOrganizationOwner(this.userId);
    logger.info('started prediction update job');
    var locations = Locations.find({archived: {$ne: true}});
    locations.forEach(updateForecastForLocation);
    return true;
  },

  getPredictionModelStatus: function () {
    checkOrganizationOwner(this.userId);
    var currentArea = HospoHero.getCurrentArea(this.userId);
    var googlePredictionApi = new GooglePredictionApi(currentArea.locationId);
    return googlePredictionApi.getModelStatus();
  },

  resetForecastData: function () {
    DailySales.update({}, {$unset: {predictionQuantity: '', predictionUpdatedAt: ''}}, {multi: true});
    Locations.update({}, {$unset: {lastForecastModelUploadDate: ''}}, {multi: true});
  }
});