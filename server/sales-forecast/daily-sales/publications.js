var checkForecastPermission = function (subscribtion) {
  var haveAccess = HospoHero.canUser('view forecast', subscribtion.userId);
  if (!haveAccess) {
    subscribtion.error(new Meteor.Error(403, 'Access Denied'));
  }
  return haveAccess;
};


Meteor.publish('dailySales', function (weekRange, areaId) {
  check(weekRange, HospoHero.checkers.WeekRange);

  if (checkForecastPermission(this)) {
    logger.info('Daily sales subscription', weekRange);

    return DailySales.find({'relations.areaId': areaId, date: weekRange});
  }
});


Meteor.publish('areaMenuItemsInfiniteScroll', function (limit, areaId) {
  check(limit, Number);

  if (checkForecastPermission(this)) {
    logger.info('Menu items for forecast subscription', {limit: limit});

    var query = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': areaId});

    return MenuItems.find(query, {limit: limit});
  }
});