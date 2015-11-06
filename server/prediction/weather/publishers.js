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