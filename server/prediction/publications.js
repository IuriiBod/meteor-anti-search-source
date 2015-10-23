Meteor.publish("salesPrediction", function (year, week) {
  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }
  var weekDate = moment().year(year).week(week);
  var areaId = HospoHero.getCurrentAreaId(this.userId);
  return SalesPrediction.find({"relations.areaId": areaId, date:TimeRangeQueryBuilder.forWeek(weekDate)});
});


Meteor.publish("importedActualSales", function (year, week) {
  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }
  var weekDate = moment().year(year).week(week);
  var areaId = HospoHero.getCurrentAreaId(this.userId);
  return ImportedActualSales.find({"relations.areaId": areaId, date:TimeRangeQueryBuilder.forWeek(weekDate)});
});