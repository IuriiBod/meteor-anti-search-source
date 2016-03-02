var updateMenuItemsPriceFromPos = function (locationId) {
  var menuItems = MenuItems.find({
    posNames: {$exists: true, $not: {$size: 0}},
    'relations.locationId': locationId
  });

  menuItems.forEach(function (item) {
    item.posNames.forEach(function (posName) {
      var posObj = PosMenuItems.findOne({name: posName, 'relations.locationId': locationId});
      if (posObj) {
        MenuItems.update({_id: item._id}, {$set: {salesPrice: posObj.price}});
        return false;
      }
    });
  });
};

Meteor.methods({
  updatePosMenuItems: function () {
    var checker = new HospoHero.security.PermissionChecker();
    if (!checker.hasPermissionInArea(null, 'view forecast')) {
      throw new Meteor.Error('Access denied');
    }

    var relationObj = HospoHero.getRelationsObject();
    var locationId = relationObj.locationId;

    if (!HospoHero.prediction.isAvailableForLocation(locationId)) {
      throw new Meteor.Error("Current location hadn't connected POS system");
    }

    var posCredentials = Locations.findOne({_id: locationId}).pos;

    var revel = new Revel(posCredentials);
    var data = revel.loadProductItems();

    if (!_.isArray(data)) {
      throw new Meteor.Error("Failed to update menu items from POS");
    }

    PosMenuItems.remove({'relations.locationId': locationId});

    data.forEach(function (item) {
      item.relations = relationObj;
      PosMenuItems.insert(item);
    });

    updateMenuItemsPriceFromPos(locationId);
  }
});

