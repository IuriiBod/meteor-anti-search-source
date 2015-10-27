Meteor.publish('weatherForecast', function (year, week) {
  check(year, Number);
  check(week, Number);

  logger.info('Weather subscribe ', {year: year, week: week});

  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var currentArea = HospoHero.getCurrentArea(this.userId);
  var locationId = currentArea.locationId;

  new WeatherManager(locationId).updateForecast();

  var date = HospoHero.dateUtils.getDateByWeekDate({year: year, week: week});
  var weekRange = TimeRangeQueryBuilder.forWeek(date);

  return WeatherForecast.find({date: weekRange, locationId: locationId});
});