var locationId = 1;



var updateWeatherForecastForLocation = function (locationId) {
  //check if we need an update

  //if true -> query open weather map
};


Meteor.publish('weatherForecast', function () {
  var self = this;

  var haveAccess = isManagerOrAdmin(this.userId);
  if (!haveAccess) {
    self.error(new Meteor.Error(403, 'Access Denied'));
  }

  try {
    //todo: use dynamic location
    var forecast = OpenWeatherMap.forecast(Meteor.settings.Location);

    forecast.forEach(function (weatherEntry) {
      self.added('weatherForecast', Random.id(), weatherEntry);
    });

    self.ready();
  } catch (err) {
    self.error(err);
  }
});