var checkForecastPermission = function (subscribtion) {
  var checker = new HospoHero.security.PermissionChecker(subscribtion.userId);
  var haveAccess = checker.hasPermissionInArea(HospoHero.getCurrentAreaId(), 'view forecast');
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