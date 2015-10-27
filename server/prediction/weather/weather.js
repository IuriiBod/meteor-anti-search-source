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
  },

  uploadWeatherHistoricalDataForLocation: function (locationId) {
    var location = Locations.findOne({_id: locationId});
    var weatherConnector = new WorldWeather(location.city);
    var nowMoment = moment();

    var isWeatherAvailableForMonth = function (monthMomentToCheck) {
      var iterateMoment = moment(monthMomentToCheck); // copy moment

      //start from first date
      iterateMoment.date(1);

      var isAvailable = true;

      //check always to the end of month or current date
      while (!iterateMoment.isSame(monthMomentToCheck, 'month') || !iterateMoment.isSame(nowMoment, 'day')) {
        var forecastsCount = WeatherForecast.find({
          date: TimeRangeQueryBuilder.forDay(iterateMoment.toDate()),
          locationId: locationId
        }).count();

        if (forecastsCount === 0) {
          isAvailable = false;
          break;
        }

        iterateMoment.add(1, 'day');
      }
      return isAvailable;
    };

    var uploadHistoricalDataForMonth = function (monthMoment) {
      var start = new Date(monthMoment.startOf('month'));
      monthMoment.endOf('month');

      //to the end of month or to current date if end in future
      var end = monthMoment.isBefore(nowMoment) ? monthMoment.toDate() : nowMoment.toDate();

      var weatherData = weatherConnector.getHistorical(start, end);

      if (_.isArray(weatherData)) {
        weatherData.forEach(function (weatherEntry) {
          //store historical data in the same collection as forecast
          WeatherForecast.insert(_.extend(weatherEntry, {
            locationId: locationId
          }));
        });
      }
    };

    var iterateMonthMoment = moment().subtract(1, 'year');

    //iterate over last 12 months
    for (var i = 0; i < 12; i++) {
      //check if we need refresh historical data
      if (!isWeatherAvailableForMonth(iterateMonthMoment)) {
        //refresh historical data
        uploadHistoricalDataForMonth(iterateMonthMoment);
      }
      iterateMonthMoment.add(1, 'month');
    }
  }
};