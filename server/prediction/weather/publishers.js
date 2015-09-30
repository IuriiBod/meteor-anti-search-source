var locationId = 1;


Meteor.publish('weatherForecast', function (date) {
  check(date, Date);

  var self = this;

  var haveAccess = isManagerOrAdmin(this.userId);
  if (!haveAccess) {
    self.error(new Meteor.Error(403, 'Access Denied'));
  }

  console.log('subscribed');
  
  OpenWeatherMap.updateWeatherForecastForLocation(locationId);

  return WeatherForecast.find({date: TimeRangeQueryBuilder.forWeek(date)});
});