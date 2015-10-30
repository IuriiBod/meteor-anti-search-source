Meteor.publish('dailySales', function (weekRange) {
  check(weekDate, HospoHero.checkers.WeekRange);

  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  logger.info('Daily sales subscription', weekRange);

  var areaId = HospoHero.getCurrentAreaId(this.userId);

  return DailySales.find({'relations.areaId': areaId, date: weekRange});
});


Meteor.publish('areaMenuItemsInfiniteScroll', function (limit) {
  check(limit, Number);

  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  logger.info('Menu items for forecast subscription', {limit: limit});

  var currentAreaId = HospoHero.getCurrentAreaId(this.userId);
  var query = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': currentAreaId});

  return MenuItems.find(query, {limit: limit});
});