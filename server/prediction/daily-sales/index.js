Meteor.methods({
  synchronizeActualSales: function () {
    var haveAccess = HospoHero.canUser('view forecast', this.userId);
    if (!haveAccess) {
      throw new Meteor.Error(403, 'Access Denied');
    }

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
      MenuItems.update(unsyncedItemsQuery, {$set: {isNotSyncedWithPos: false}})
    }
  }
});
