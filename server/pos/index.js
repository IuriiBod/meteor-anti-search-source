Meteor.methods({
  'updatePos': function () {
    var posCredentials = {
      host: Meteor.settings.Revel.HOST,
      key: Meteor.settings.Revel.KEY,
      secret: Meteor.settings.Revel.SECRET
    };
    var revel = new Revel(posCredentials);
    var data = revel.queryRevelProductItems();
    var relationObj = HospoHero.getRelationsObject();
    if (data) {
      PosMenuItems.remove({'relations.locationId': relationObj.locationId});
      _.each(data, function (item) {
        item.relations = relationObj;
        PosMenuItems.insert(item);
      });
      Meteor.call('updateMenuItemsPriceFromPos');
    }
    else {
      throw new Meteor.error("Failed to update POS");
    }
  },

  'updateMenuItemsPriceFromPos': function () {
    var menuItems = MenuItems.find({posNames: {$exists: true, $not: {$size: 0}}}).fetch();
    _.each(menuItems, function (item) {
      item.posNames.forEach(function (posName) {
        var posObj = PosMenuItems.findOne({name: posName});
        if(posObj){
          MenuItems.update({_id: item._id}, {$set:{salesPrice: posObj.price}});
          return false;
        }
      });
    });
  }
});