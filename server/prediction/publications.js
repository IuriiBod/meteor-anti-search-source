Meteor.publish('dailySales', function (weekRange, areaId) {
  check(weekRange, HospoHero.checkers.WeekRange);


  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  logger.info('Daily sales subscription', weekRange);

  return DailySales.find({'relations.areaId': areaId, date: weekRange});
});

Meteor.publish('areaMenuItemsInfiniteScroll', function (limit, areaId) {
  check(limit, Number);

  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  logger.info('Menu items for forecast subscription', {limit: limit});
  var query = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': areaId});

  return MenuItems.find(query, {limit: limit});
});