//todo: SHOULD BE MOVED TO CLIENT SETTINGS
LOCATION = Meteor.settings.LOCATION;


Meteor.publish('weatherForecast', function () {
  var self = this;

  var haveAccess = isManagerOrAdmin(this.userId);
  if (!haveAccess) {
    self.error(new Meteor.Error(403, 'Access Denied'));
  }

  try {
    var forecast = OpenWeatherMap.forecast(LOCATION);

    forecast.forEach(function (weatherEntry) {
      self.added('weatherForecast', Random.id(), weatherEntry);
    });

    self.ready();
  } catch (err) {
    self.error(err);
  }
});