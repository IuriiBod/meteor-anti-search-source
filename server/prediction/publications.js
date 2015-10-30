Meteor.publish('dailySales', function (weekDate, areaId) {
  check(weekDate, HospoHero.checkers.WeekDate);

  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var targetDate = HospoHero.dateUtils.getDateByWeekDate(weekDate);

  return DailySales.find({'relations.areaId': areaId, date: TimeRangeQueryBuilder.forWeek(targetDate)});
});

Meteor.publish('areaMenuItemsInfiniteScroll', function (limit, areaId) {
  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var query = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': areaId});

  return MenuItems.find(query, {limit: limit});
});