WEATHER_URL = 'http://api.openweathermap.org/data/2.5/forecast/daily';
API_KEY = Meteor.settings.private.OpenWeatherMap.KEY;

//todo: SHOULD BE MOVED TO CLIENT SETTINGS
LOCATION = Meteor.settings.private.LOCATION;


convertDtToDate = function (dt) {
  return moment(new Date(dt * 1000)).format('YYYY-MM-DD');
};


Meteor.publish('weatherForecast', function () {
  var self = this;

  var haveAccess = isManagerOrAdmin(this.userId);
  if (!haveAccess) {
    self.error(new Meteor.Error(403, 'Access Denied'));
  }

  var res = HTTP.get(WEATHER_URL, {
    params: {
      q: LOCATION,
      mode: 'json',
      units: 'metric',
      cnt: 16,
      APPID: API_KEY
    }
  });

  if (res.statusCode === 200) {
    res.data.list.map(function (weatherEntry) {
      return {
        date: convertDtToDate(weatherEntry.dt),
        temp: weatherEntry.temp.eve,
        main: weatherEntry.weather[0].main,
        icon: weatherEntry.weather[0].icon
      }
    }).forEach(function (weatherEntry) {

      self.added('weatherForecast', Random.id(), weatherEntry);
    });
    self.ready()
  } else {
    self.error(new Meteor.Error(res.statusCode, 'OpenWeatherMap Access Error'));
  }
});