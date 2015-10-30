Meteor.publish('weatherForecast', function (weekRange) {
  check(weekDate, HospoHero.checkers.WeekRange);

  logger.info('Weather subscribe ', weekRange);

  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var currentArea = HospoHero.getCurrentArea(this.userId);
  var locationId = currentArea.locationId;

  new WeatherManager(locationId).updateForecast();

  return WeatherForecast.find({date: weekRange, locationId: locationId});
});