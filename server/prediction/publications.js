Meteor.publish("salesPrediction", function () {
  var haveAccess = HospoHero.canUser('view forecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var areaId = HospoHero.getCurrentAreaId(this.userId);
  return SalesPrediction.find({"relations.areaId": areaId});
});

Meteor.publish("importedActualSales", function () {
  var haveAccess = HospoHero.canUser('view forecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var areaId = HospoHero.getCurrentAreaId(this.userId);
  return ImportedActualSales.find({"relations.areaId": areaId});
});