//todo introduce locations here (as subscription param)
var locationId = 1;


Meteor.publish('weatherForecast', function (date) {
  check(date, Date);

  //todo: uncomment after roles improvement
  //var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
  //if (!haveAccess) {
  //  this.error(new Meteor.Error(403, 'Access Denied'));
  //}

  OpenWeatherMap.updateWeatherForecastForLocation(locationId);

  return WeatherForecast.find({date: TimeRangeQueryBuilder.forWeek(date)});
});