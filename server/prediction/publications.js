Meteor.publish("salesPrediction", function () {
  var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var areaId = HospoHero.getCurrentAreaId(this.userId);
  return SalesPrediction.find({"relations.areaId": areaId});
});

Meteor.publish("importedActualSales", function () {
  var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var areaId = HospoHero.getCurrentAreaId(this.userId);
  return ImportedActualSales.find({"relations.areaId": areaId});
});

Meteor.publish("areaMenuItemsInfiniteScroll", function (limit) {
  var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }
  var currentAreaId = HospoHero.getCurrentAreaId(this.userId);
  var specialsCategory = Categories.findOne({name: 'Specials'});
    var specialsCategoryId = null;
  if (specialsCategory) {
    specialsCategoryId = specialsCategory._id;
  }
  return MenuItems.find({'relations.areaId': currentAreaId, status: {$ne: "ideas"}, category: {$ne: specialsCategoryId}}, {limit: limit});
});