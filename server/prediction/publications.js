var checkForecastPrermssion = function (subscribtion) {
  var haveAccess = HospoHero.canUser('view forecast', subscribtion.userId);
  if (!haveAccess) {
    subscribtion.error(new Meteor.Error(403, 'Access Denied'));
  }
  return haveAccess;
};


Meteor.publish('dailySales', function (weekRange, areaId) {
  check(weekRange, HospoHero.checkers.WeekRange);

  if (checkForecastPrermssion(this)) {
    logger.info('Daily sales subscription', weekRange);

    return DailySales.find({'relations.areaId': areaId, date: weekRange});
  }
});


Meteor.publish('areaMenuItemsInfiniteScroll', function (limit, areaId) {
  check(limit, Number);

  if (checkForecastPrermssion(this)) {
    logger.info('Menu items for forecast subscription', {limit: limit});

    var query = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.areaId': areaId});

    return MenuItems.find(query, {limit: limit});
  }
});


Meteor.publish('weatherForecast', function (weekRange, areaId) {
  check(weekRange, HospoHero.checkers.WeekRange);
  check(areaId, HospoHero.checkers.MongoId);

  logger.info('Weather subscribe ', weekRange);

  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var currentArea = Areas.findOne({_id: areaId});

  if (currentArea) {
    var locationId = currentArea.locationId;
    new WeatherManager(locationId).updateForecast();
  }

  return WeatherForecast.find({date: weekRange, locationId: locationId});
});