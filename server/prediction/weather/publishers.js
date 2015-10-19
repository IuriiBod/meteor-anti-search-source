Meteor.publish('weatherForecast', function (year, week) {
  check(year, Number);
  check(year, Number);

  var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var currentArea = HospoHero.getCurrentArea(this.userId);
  var locationId = currentArea.locationId;

  Weather.updateWeatherForecastForLocation(locationId);

  var date = HospoHero.dateUtils.getDateByWeekDate({year: year, week: week});
  var weekRange = TimeRangeQueryBuilder.forWeek(date);

  return WeatherForecast.find({date: weekRange, locationId: locationId});
});