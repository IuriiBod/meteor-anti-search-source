Meteor.publish('salesPrediction', function () {
  var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var areaId = HospoHero.getCurrentAreaId(this.userId);
  return SalesPrediction.find({'relations.areaId': areaId});
});

Meteor.publish('importedActualSales', function () {
  var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var areaId = HospoHero.getCurrentAreaId(this.userId);
  return ImportedActualSales.find({'relations.areaId': areaId});
});

Meteor.publish('areaMenuItemsInfiniteScroll', function (limit) {
  var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var currentAreaId = HospoHero.getCurrentAreaId(this.userId);
  var query = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': currentAreaId});

  return MenuItems.find(query, {limit: limit});
});