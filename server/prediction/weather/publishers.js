Meteor.publish('weatherForecast', function (year, week) {
  check(year, Number);
  check(year, Number);

  var date = HospoHero.dateUtils.getDateByWeekDate({year: year, week: week});

  var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
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