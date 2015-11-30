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

    var menuItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({
      'relations.locationId': currentArea.locationId
    }, true);

    var predictedMenuItems = MenuItems.find(menuItemsQuery, {fields: {name: 1, _id: 1}});

    var modelsStatuses = {};
    predictedMenuItems.forEach(function (menuItem) {
      modelsStatuses[menuItem.name] = googlePredictionApi.getModelStatus(menuItem._id);
    });

    return _.reduce(modelsStatuses, function (result, status, name) {
      return result + name + ': ' + status + '\n';
    }, '');
  },

  resetForecastData: function () {
    DailySales.update({}, {$unset: {predictionQuantity: '', predictionUpdatedAt: ''}}, {multi: true});
    Locations.update({}, {$unset: {lastForecastModelUploadDate: ''}}, {multi: true});
  }
});