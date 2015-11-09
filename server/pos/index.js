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
    }
    else{
      throw new Meteor.error("Failed to update POS");
    }
  }
});