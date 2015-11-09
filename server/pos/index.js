Meteor.methods({
  'updatePos': function () {
    var posCredentials = {
      host: Meteor.settings.Revel.HOST,
      key: Meteor.settings.Revel.KEY,
      secret: Meteor.settings.Revel.SECRET
    };
    var revel = new Revel(posCredentials);
    var data = revel.queryRevelResource('Product', 'id', true, ['name', 'price'], 0);
    var relationObj = HospoHero.getRelationsObject();
    if (data) {
      PosMenuItems.remove({'relations.locationId': relationObj.locationId});
      _.each(data.objects, function (item) {
        PosMenuItems.insert({
          name: item.name,
          price: item.price,
          relations: relationObj
        });
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