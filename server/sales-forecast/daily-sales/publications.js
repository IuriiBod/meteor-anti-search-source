var checkForecastPermission = function (userId, areaId) {
  var checker = new HospoHero.security.PermissionChecker(userId);
  var haveAccess = checker.hasPermissionInArea(areaId, 'view forecast');
  if (!haveAccess) {
    subscribtion.error(new Meteor.Error(403, 'Access Denied'));
  }
  return haveAccess;
};


Meteor.publish('dailySales', function (weekRange, areaId) {
  check(weekRange, HospoHero.checkers.WeekRange);
  check(areaId, HospoHero.checkers.MongoId);

  if (checkForecastPermission(this.userId, areaId)) {
    logger.info('Daily sales subscription', weekRange);

    return DailySales.find({'relations.areaId': areaId, date: weekRange});
  }
});


Meteor.publish('areaMenuItemsInfiniteScroll', function (limit, areaId) {
  check(limit, Number);
  check(areaId, HospoHero.checkers.MongoId);

  if (checkForecastPermission(this.userId, areaId)) {
    logger.info('Menu items for forecast subscription', {limit: limit});

    var query = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': areaId});

    return MenuItems.find(query, {limit: limit});
  }
});
