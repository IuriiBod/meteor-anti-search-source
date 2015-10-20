Meteor.publish('weatherForecast', function (date) {
  check(date, Date);

  var haveAccess = HospoHero.canUser('view forecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var currentArea = HospoHero.getCurrentArea(this.userId);
  var locationId = currentArea.locationId;

  OpenWeatherMap.updateWeatherForecastForLocation(locationId);

  var weekRange = TimeRangeQueryBuilder.forWeek(date);

  logger.warn('publish weather forecast for: ', date, ' date range: ', weekRange);

  return WeatherForecast.find({date: weekRange, locationId: locationId});
});