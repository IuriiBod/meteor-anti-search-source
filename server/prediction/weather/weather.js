Weather = {
  updateWeatherForecastForLocation: function (locationId) {
    logger.info('updating weather forecast for location', {_id: locationId});

    //check if we need an update forecast
    var today = moment().startOf('day').toDate();//today is start of day

    var lastForecast = WeatherForecast.findOne({locationId: locationId, date: today});
    var needUpdate = !lastForecast || !moment(lastForecast.updatedAt).isSame(today, 'day');

    if (needUpdate) {
      var location = Locations.findOne({_id: locationId});
      var worldWeather = new WorldWeather(location.city);
      var weatherForecastList = worldWeather.getForecast();
      weatherForecastList.forEach(function (forecast) {
        var forecastDate = moment(forecast.date).startOf('day').toDate();
        var forecastEntry = _.extend(forecast, {
          date: forecastDate,
          updatedAt: today,
          locationId: locationId
        });
        WeatherForecast.update({
          locationId: locationId,
          date: forecastDate
        }, {$set: forecastEntry}, {upsert: true});
      });
    }
  }
};