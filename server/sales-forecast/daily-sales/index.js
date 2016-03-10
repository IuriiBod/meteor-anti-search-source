var checkForecastPermissions = function () {
  var checker = new HospoHero.security.PermissionChecker();
  if (!checker.hasPermissionInArea(null, 'view forecast')) {
    throw new Meteor.Error(403, 'Access Denied');
  }
};

Meteor.methods({
  synchronizeActualSales: function () {
    checkForecastPermissions();

    //find out current area
    var area = HospoHero.getCurrentArea(this.userId);

    if (!area) {
      throw new Meteor.Error('Current area not specified');
    }

    var locationId = area.locationId;

    if (!HospoHero.prediction.isAvailableForLocation(locationId)) {
      throw new Meteor.Error("Current location hadn't connected POS system");
    }

    //find out which items should be synchronized
    var unsyncedItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({
      'relations.locationId': locationId,
      isNotSyncedWithPos: true
    }, true);

    var menuItemsToSyncCount = MenuItems.find(unsyncedItemsQuery, {fields: {_id: 1}}).count();

    if (menuItemsToSyncCount > 0) {
      var salesImporter = new ActualSalesImporter(locationId);
      salesImporter.importAll(true);

      //force to update prediction model
      var predictionApi = new GooglePredictionApi(locationId);
      predictionApi.updatePredictionModel(unsyncedItemsQuery, true);
    } else {
      logger.info('Nothing to sync');
    }
  },

  editForecast: function (menuItemId, date, predictedQuantity) {
    check(menuItemId, HospoHero.checkers.MongoId);
    check(date, Date);
    check(predictedQuantity, Number);

    checkForecastPermissions();

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

    checkForecastPermissions();

    DailySales.update({_id: dailySaleId}, {$unset: {manualPredictionQuantity: ''}});
  }
});
