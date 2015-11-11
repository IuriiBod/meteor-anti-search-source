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

    var locationId = area.relations.locationId;

    if (!Hospohero.prediction.isAvailableForLocation(locationId)) {
      throw new Meteor.Error("Current location hadn't connected POS system")
    }

    var location = Locations.findOne({_id: locationId});

    //find out which items should be synchronized
    var unsyncedItemsQuery = {'relations.areaId': area._id, isNotSyncedWithPos: true};
    var menuItemsToSync = MenuItems.find(unsyncedItemsQuery, {fields: {_id: 1, posNames: 1}});
    var unsyncedItemsIds = menuItemsToSync.map(function (item) {
      return item._id;
    });

    //remove old sales data
    DailySales.remove({_id: {$in: unsyncedItemsIds}});

    //upload sales using pos connector
    var posConnector = new Revel(location.pos);
    menuItemsToSync.forEach(function (menuItem) {
      menuItem.posNames.forEach(function (posName) {
        var posMenuItem = PosMenuItems.findOne({name: posName, 'relations.locationId': locationId});
        posConnector.uploadAndReduceOrderItems(function (uploadedData) {
          //todo: use actual sales importer here
        }, posMenuItem.posId);
      });
    });


    //mark all menu items as sales synchronized
    MenuItems.update(unsyncedItemsQuery, {$set: {isNotSyncedWithPos: false}})
  }
});
