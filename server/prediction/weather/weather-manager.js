/**
 * Used to uploading historical/forecast and reading weather for specified location
 *
 * @param locationId
 * @constructor
 */
WeatherManager = function WeatherManager(locationId) {
  this._locationId = locationId;

  var location = Locations.findOne({_id: locationId});
  this._weatherConnector = new WorldWeather(location.city);
};

/**
 * Returns weather for specified date
 *
 * @param {date|moment} date
 * @returns {object|null} weather forecast
 */
WeatherManager.prototype.getWeatherFor = function (date) {
  return WeatherForecast.findOne({locationId: this._locationId, date: TimeRangeQueryBuilder.forDay(date)});
};

//todo: write docs for other methods

WeatherManager.prototype.updateForecast = function () {
  var locationId = this._locationId;

  logger.info('updating weather forecast for location', {_id: locationId});

  //check if we need an update forecast
  var today = moment().startOf('day').toDate();//today is start of day

  var lastForecast = WeatherForecast.findOne({locationId: locationId, date: today});
  var needUpdate = !lastForecast || !moment(lastForecast.updatedAt).isSame(today, 'day');

  if (needUpdate) {
    var weatherForecastList = this._weatherConnector.getForecast();

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
};


WeatherManager.prototype.updateHistorical = function () {
  var iterateMonthMoment = moment().subtract(1, 'year');

  //iterate over last 12 months including current month
  for (var i = 0; i <= 12; i++) {
    //check if we need refresh historical data
    if (!this._isWeatherAvailableForMonth(iterateMonthMoment)) {
      //refresh historical data
      this._uploadHistoricalDataForMonth(iterateMonthMoment);
    }
    iterateMonthMoment.add(1, 'month');
  }
};


WeatherManager.prototype._isWeatherAvailableForMonth = function (monthMomentToCheck) {
  var nowMoment = moment();
  var endOfMonth = moment(monthMomentToCheck).endOf('month');
  var startOfMonth = moment(monthMomentToCheck).startOf('month');
  var isCurrentMonth = monthMomentToCheck.isSame(nowMoment, 'month');

  var dateQuery = isCurrentMonth ? {
    $gte: startOfMonth.toDate(),
    $lte: moment().endOf('day')
  } : TimeRangeQueryBuilder.forMonth(monthMomentToCheck);

  var monthForecastCount = WeatherForecast.find({
    date: dateQuery,
    locationId: this._locationId
  }).count();

  var requiredCount = isCurrentMonth ? endOfMonth.date() : nowMoment.date();

  return monthForecastCount >= requiredCount;
};


WeatherManager.prototype._uploadHistoricalDataForMonth = function (monthMoment) {
  var nowMoment = moment();

  var start = new Date(monthMoment.startOf('month'));
  monthMoment.endOf('month');

  //to the end of month or to current date if end in future
  var end = monthMoment.isBefore(nowMoment) ? monthMoment.toDate() : nowMoment.toDate();

  var weatherData = this._weatherConnector.getHistorical(start, end);

  var locationId = this._locationId;
  if (_.isArray(weatherData)) {
    weatherData.forEach(function (weatherEntry) {
      //store historical data in the same collection as forecast
      var infoToUpdate = _.extend(weatherEntry, {
        locationId: locationId
      });

      WeatherForecast.update({
        date: TimeRangeQueryBuilder.forDay(infoToUpdate.date),
        locationId: locationId
      }, {$set: infoToUpdate}, {upsert: true});
    });
  }
};