Meteor.publish('weatherForecast', function (weekDate, areaId) {
  check(weekDate, HospoHero.checkers.WeekDate);

  logger.info('Weather subscribe ', weekDate);

  var haveAccess = HospoHero.canUser('view forecast', this.userId);
  if (!haveAccess) {
    this.error(new Meteor.Error(403, 'Access Denied'));
  }

  var currentArea = Areas.findOne({ _id: areaId });
  var locationId = currentArea.locationId;

  new WeatherManager(locationId).updateForecast();

  var date = HospoHero.dateUtils.getDateByWeekDate(weekDate);
  var weekRange = TimeRangeQueryBuilder.forWeek(date);

  return WeatherForecast.find({date: weekRange, locationId: locationId});
});