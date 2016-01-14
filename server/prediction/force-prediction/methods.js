var checkOrganizationOwner = function (userId) {
  if (!HospoHero.isOrganizationOwner(userId)) {
    throw new Meteor.Error(403, 'You have no power here!');
  }
};

//this collection is used to imitate Revel API with real data
RawOrders = new Mongo.Collection('rawOrders');
RawOrders._ensureIndex({created_date: -1});


Meteor.methods({
  updatePredictionModel: function () {
    checkOrganizationOwner(this.userId);
    var locations = Locations.find({archived: {$ne: true}});
    locations.forEach(updateTrainingDataForLocation);
    return true;
  },

  resetForecastData: function () {
    checkOrganizationOwner(this.userId);
    var currentArea = HospoHero.getCurrentArea(this.userId);

    //remove only sales with actual quantity
    DailySales.remove({
      predictionQuantity: {$exists: false},
      'relations.locationId': currentArea.locationId
    });

    DailySales.update({
      'relations.locationId': currentArea.locationId
    }, {
      $unset: {
        actualQuantity: ''
      }
    }, {multi: true});

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


  importRawOrders: function () {
    checkOrganizationOwner(this.userId);
    //remove old data
    RawOrders.remove({});

    var area = HospoHero.getCurrentArea(this.userId);
    var location = Locations.findOne({_id: area.locationId});
    var revelApi = new Revel(location.pos);
    revelApi.uploadRawOrderItems(function (orderItems) {
      orderItems.forEach(function (item) {
        RawOrders.insert(item);
      });
    });
    return true;
  }
});