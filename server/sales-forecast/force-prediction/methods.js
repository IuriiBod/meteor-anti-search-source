/*jshint camelcase: false */

var checkOrganizationOwner = function (userId) {
  let currentOrganizationId = HospoHero.getOrganizationIdBasedOnCurrentArea(userId);
  let permissionChecker = new HospoHero.security.PermissionChecker(userId);
  if (!permissionChecker.isOrganizationOwner(currentOrganizationId)) {
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

    locations.forEach((location) => {
      logger.info('Force prediction model update for', {_id: location._id, name: location.name});
      MenuItems.update({'relations.locationId': location._id}, {$unset: {lastForecastModelUpdateDate: ''}}, {multi: true});
      updateTrainingDataForLocation(location, true);
    });

    return true;
  },

  //resetForecastData: function () {
  //  checkOrganizationOwner(this.userId);
  //  var currentArea = HospoHero.getCurrentArea(this.userId);
  //
  //  //remove only sales with actual quantity
  //  DailySales.remove({
  //    predictionQuantity: {$exists: false},
  //    'relations.locationId': currentArea.locationId
  //  });
  //
  //  DailySales.update({
  //    'relations.locationId': currentArea.locationId
  //  }, {
  //    $unset: {
  //      actualQuantity: ''
  //    }
  //  }, {multi: true});
  //
  //  return true;
  //},

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

    var lastOrderItem = RawOrders.findOne({}, {sort: {created_date: -1}});

    var isLastSynced = function (orderItem) {
      return lastOrderItem && lastOrderItem.created_date === orderItem.created_date &&
        lastOrderItem.quantity === orderItem.quantity &&
        lastOrderItem.resource_uri === orderItem.resource_uri;
    };

    var area = HospoHero.getCurrentArea(this.userId);
    var location = Locations.findOne({_id: area.locationId});
    var revelApi = new Revel(location.pos);

    var toContinue = true;
    revelApi.uploadRawOrderItems(function (orderItems) {
      orderItems.every(function (item) {
        if (isLastSynced(item) || !toContinue) {
          toContinue = false;
          return false;
        } else {
          RawOrders.insert(item);
          return true;
        }
      });
      return toContinue;
    });

    return true;
  }
});