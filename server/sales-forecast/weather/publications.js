var checkForecastPermission = function (subscribtion) {
  var haveAccess = HospoHero.canUser('view forecast', subscribtion.userId);
  if (!haveAccess) {
    subscribtion.error(new Meteor.Error(403, 'Access Denied'));
  }
  return haveAccess;
};


Meteor.publish('weatherForecast', function (weekRange, areaId) {
  check(weekRange, HospoHero.checkers.WeekRange);
  check(areaId, HospoHero.checkers.MongoId);

  logger.info('Weather subscribe ', weekRange);

  if (checkForecastPermission(this)) {
    var currentArea = Areas.findOne({_id: areaId});

    if (currentArea) {
      var locationId = currentArea.locationId;
      new WeatherManager(locationId).updateForecast();
    }

    return WeatherForecast.find({date: weekRange, locationId: locationId});
  }
});