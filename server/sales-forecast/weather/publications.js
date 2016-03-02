var checkForecastPermission = function (areaId, context) {
  var checker = new HospoHero.security.PermissionChecker(this.userId);
  var haveAccess = checker.hasPermissionInArea(areaId, 'view forecast');

  if (!haveAccess) {
    context.error(new Meteor.Error(403, 'Access Denied'));
  }

  return haveAccess;
};


Meteor.publish('weatherForecast', function (weekRange, areaId) {
  check(weekRange, HospoHero.checkers.WeekRange);
  check(areaId, HospoHero.checkers.MongoId);

  logger.info('Weather subscribe ', weekRange);

  if (checkForecastPermission(areaId, this)) {
    var currentArea = Areas.findOne({_id: areaId});

    if (!currentArea) {
      this.ready();
      return;
    }

    var locationId = currentArea.locationId;
    new WeatherManager(locationId).updateForecast();
    return WeatherForecast.find({date: weekRange, locationId: locationId});
  }
});