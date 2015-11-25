var checkForecastPermissions = function (userId) {
  var haveAccess = HospoHero.canUser('view forecast', userId);
  if (!haveAccess) {
    throw new Meteor.Error(403, 'Access Denied');
  }
};

Meteor.methods({
  synchronizeActualSales: function () {
    checkForecastPermissions(this.userId);

    //find out current area
    var area = HospoHero.getCurrentArea(this.userId);

    if (!area) {
      throw new Meteor.Error('Current area not specified');
    }

    var locationId = area.locationId;

    if (!HospoHero.prediction.isAvailableForLocation(locationId)) {
      throw new Meteor.Error("Current location hadn't connected POS system")
    }

    var location = Locations.findOne({_id: locationId});

    //find out which items should be synchronized
    var unsyncedItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({
      'relations.areaId': area._id,
      isNotSyncedWithPos: true
    }, true);

    var menuItemsToSync = MenuItems.find(unsyncedItemsQuery, {fields: {_id: 1}});

    if (menuItemsToSync.count() > 0) {
      var unsyncedItemsIds = menuItemsToSync.map(function (menuItem) {
        return menuItem._id;
      });

      //remove old sales data
      DailySales.remove({_id: {$in: unsyncedItemsIds}});

      var salesImporter = new ActualSalesImporter(locationId);
      salesImporter.importByQuery(unsyncedItemsQuery);

      //mark all menu items as sales synchronized
      MenuItems.update(unsyncedItemsQuery, {$set: {isNotSyncedWithPos: false}}, {multi: true});

      //force to update prediction model
      var predictionApi = new GooglePredictionApi(location._id);
      predictionApi.updatePredictionModel(true);
    } else {
      logger.info('Nothing to sync');
    }
  },

  editForecast: function (menuItemId, date, predictedQuantity) {
    check(menuItemId, HospoHero.checkers.MongoId);
    check(date, Date);
    check(predictedQuantity, Number);

    checkForecastPermissions(this.userId);

    var menuItem = MenuItems.findOne({_id: menuItemId}, {fields: {relations: 1, _id: 1}});
    if (menuItem) {
      var locationId = menuItem.relations.locationId;
      var startOfDate = HospoHero.dateUtils.getDateMomentForLocation(date, locationId).startOf('day').toDate();

      DailySales.update({
        date: TimeRangeQueryBuilder.forDay(date, locationId),
        menuItemId: menuItemId,
        relations: menuItem.relations
      }, {
        $set: {
          date: startOfDate,
          manualPredictionQuantity: predictedQuantity,
          relations: menuItem.relations
        }
      }, {upsert: true});
    } else {
      logger.error('Menu item not found', {id: menuItemId});
    }
  },

  removeManualForecast: function (dailySaleId) {
    check(dailySaleId, HospoHero.checkers.MongoId);

    checkForecastPermissions(this.userId);

    DailySales.update({_id: dailySaleId}, {$unset: {manualPredictionQuantity: ''}});
  }
});
