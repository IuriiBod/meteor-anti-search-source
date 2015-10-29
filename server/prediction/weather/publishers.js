Meteor.publish('weatherForecast', function (weekYear) {
  check(weekYear.year, Number);
  check(weekYear.week, Number);

  logger.info('Weather subscribe ', {year: weekYear.year, week: weekYear.week});

  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var currentArea = HospoHero.getCurrentArea(this.userId);
  var locationId = currentArea.locationId;

  Weather.updateWeatherForecastForLocation(locationId);

  var date = HospoHero.dateUtils.getDateByWeekDate({year: weekYear.year, week: weekYear.week});
  var weekRange = TimeRangeQueryBuilder.forWeek(date);

  return WeatherForecast.find({date: weekRange, locationId: locationId});
});