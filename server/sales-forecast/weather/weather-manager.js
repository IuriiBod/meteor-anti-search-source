/**
 * Used to uploading historical/forecast and reading weather for specified location
 *
 * @param locationId
 * @constructor
 */
WeatherManager = function WeatherManager(locationId) {
  this._locationId = locationId;
  this.location = Locations.findOne({_id: locationId});

  this._weatherConnector = new WorldWeather(this.location.city);
};

/**
 * Returns weather for specified date
 *
 * @param {date|moment} date
 * @returns {object|null} weather forecast
 */
WeatherManager.prototype.getWeatherFor = function (date) {
  return WeatherForecast.findOne({
    locationId: this._locationId,
    date: TimeRangeQueryBuilder.forDay(date, this.location)
  });
};

/**
 * Returns local moment for current location
 *
 * @param {date} [date]
 * @returns {*}
 * @private
 */
WeatherManager.prototype._getLocalMomentByDate = function (date) {
  return HospoHero.dateUtils.getDateMomentForLocation(date || new Date(), this.location);
};

/**
 * Updates weather forecast for current location
 */
WeatherManager.prototype.updateForecast = function () {
  var locationId = this._locationId;

  logger.info('updating weather forecast for location', {_id: locationId});

  //today is start of day
  var today = this._getLocalMomentByDate().startOf('day');

  var lastForecast = WeatherForecast.findOne({
    locationId: locationId,
    date: TimeRangeQueryBuilder.forDay(today, this.location)
  }, {sort: {date: -1}});

  //check if we need an update forecast
  var needUpdate = !lastForecast || !today.isSame(lastForecast.updatedAt, 'day');

  if (needUpdate) {
    try {
      var weatherForecastList = this._weatherConnector.getForecast();
      var self = this;

      weatherForecastList.forEach(function (forecast) {
        var forecastMoment = self._getLocalMomentByDate(forecast.date).startOf('day');

        var forecastEntry = _.extend(forecast, {
          date: forecastMoment.toDate(),
          updatedAt: today.toDate(),
          locationId: locationId
        });

        WeatherForecast.update({
          locationId: locationId,
          date: TimeRangeQueryBuilder.forDay(forecastMoment, self.location)
        }, {$set: forecastEntry}, {upsert: true});
      });
    } catch (err) {
      logger.error(err.stack);
    }
  }
};

/**
 * Updates historical data for current location
 */
WeatherManager.prototype.updateHistorical = function () {
  var iterateMonthMoment = this._getLocalMomentByDate().subtract(1, 'year');

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

/**
 * Checks if all days in current month have weather forecast
 * for current location
 *
 * @param monthMomentToCheck
 * @returns {boolean}
 * @private
 */
WeatherManager.prototype._isWeatherAvailableForMonth = function (monthMomentToCheck) {
  var nowMoment = this._getLocalMomentByDate();
  var endOfMonth = moment(monthMomentToCheck).endOf('month');
  var startOfMonth = moment(monthMomentToCheck).startOf('month');
  var isCurrentMonth = monthMomentToCheck.isSame(nowMoment, 'month');

  var dateQuery = isCurrentMonth ? {
    $gte: startOfMonth.toDate(),
    $lte: moment(nowMoment).endOf('day')
  } : TimeRangeQueryBuilder.forMonth(monthMomentToCheck, this.location);

  var monthForecastCount = WeatherForecast.find({
    date: dateQuery,
    locationId: this._locationId
  }).count();

  var requiredCount = isCurrentMonth ? nowMoment.date() : endOfMonth.date();

  return monthForecastCount >= requiredCount;
};

/**
 * Upload historical data for specified month
 *
 * @param monthMoment
 * @private
 */
WeatherManager.prototype._uploadHistoricalDataForMonth = function (monthMoment) {
  monthMoment = moment(monthMoment);//copy month moment

  // last day may be missing: 
  // we don't know when weather forecast weather becomes historical
  var nowMoment = this._getLocalMomentByDate().subtract(1, 'day');

  var start = moment(monthMoment.startOf('month'));
  monthMoment.endOf('month');

  //to the end of month or to current date if end in future
  var end = moment(monthMoment.isBefore(nowMoment) ? monthMoment : nowMoment);

  var weatherData = this._weatherConnector.getHistorical(start, end);

  if (_.isArray(weatherData)) {
    var self = this;
    weatherData.forEach(function (weatherEntry) {
      //store historical data in the same collection as forecast
      var infoToUpdate = _.extend(weatherEntry, {
        locationId: self._locationId
      });

      WeatherForecast.update({
        date: TimeRangeQueryBuilder.forDay(infoToUpdate.date, self.location),
        locationId: self._locationId
      }, {$set: infoToUpdate}, {upsert: true});
    });
  }
};