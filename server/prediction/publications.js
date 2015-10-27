Meteor.publish('dailySales', function () {
  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var areaId = HospoHero.getCurrentAreaId(this.userId);
  return DailySales.find({'relations.areaId': areaId});//ImportedActualSales
});

Meteor.publish('areaMenuItemsInfiniteScroll', function (limit) {
  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var currentAreaId = HospoHero.getCurrentAreaId(this.userId);
  var query = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': currentAreaId});

  return MenuItems.find(query, {limit: limit});
});