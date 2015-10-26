/**
 * Api key should be stored in app's settings
 * @param {String} country
 * @param {String} city
 * @constructor
 */
WorldWeather = function WorldWeather(city) {
  this._city = city;
  this._defaultParams = {
    q: this._city,
    format: "json",
    tp: 3,
    key: Meteor.settings.WorldWeather.KEY
  };
  this._url = Meteor.settings.WorldWeather.HOST;
  this._targetTime = '1200';
};

/**
 * Base method used to access world weather API
 * @private
 * @param {String} route API route for WorldWeather (weather, past-weather)
 * @param {Object} params Parameters for request (location, dates)
 * @return {Object|Boolean} Returns object with weather date. If request failed returns false
 */
WorldWeather.prototype._httpQuery = function (route, params) {
  var defaultParams = _.extend({}, this._defaultParams);
  var allParams = _.extend(defaultParams, params);
  try {
    var res = HTTP.get(this._url + route, {
      params: allParams
    });
    return res.data;
  } catch (err) {
    logger.error('WorldWeather Access Error', {params: params, error: err});
    return false;
  }
};

/**
 * Method used to get past weather for given interval
 * @param {Date|String} fromDate
 * @param {Date|String} toDate
 * @return {Array} Return an array of objects of formated weather data.
 */
WorldWeather.prototype.getHistorical = function (fromDate, toDate) {
  var startDate = moment(fromDate).format("YYYY-MM-DD");
  var endDate = moment(toDate).format("YYYY-MM-DD");
  var data = this._httpQuery("past-weather.ashx", {
    date: startDate,
    endDate: endDate
  });

  return this._mapWeatherEntries(data);
};

/**
 * Method used to get weather forecast for 15 days
 *
 * @return {Array} Return an array of objects of formated weather data.
 */
WorldWeather.prototype.getForecast = function () {
  var data = this._httpQuery("weather.ashx", {});
  return this._mapWeatherEntries(data);
};

/**
 * Method for parsing weather response
 * @param data
 * @returns {any|*|Array}
 * @private
 */
WorldWeather.prototype._mapWeatherEntries = function (data) {
  var self = this;
  return data.data.weather.map(function (weatherItem) {
    var hourly = _.find(weatherItem.hourly, function (hourlyItem) {
      return hourlyItem.time === self._targetTime;
    });

    if (!hourly) {
      throw new Meteor.Error('Weather parse error');
    }
    return {
      date: new Date(weatherItem.date),
      temp: parseInt(hourly.tempC),
      main: hourly.weatherDesc[0].value,
      icon: hourly.weatherIconUrl[0].value
    };
  });
};

/**
 * Method used to check locations existing
 *
 * @return {Boolean} Returns true if location is valid
 */
WorldWeather.prototype.checkLocation = function () {
  var data = this._httpQuery("weather.ashx", {
    q: this._city
  });
  return !data.data.error
};


//DevelopmentModeworldWeatherMixin
if (HospoHero.isDevelopmentMode()) {
  var mockDataGenerator = function () {
    var start, end;
    if (arguments.length > 0) {//historical
      start = moment(arguments[0]);
      end = moment(arguments[1]).add(1, 'day');
    } else {//forecast
      start = moment();
      end = moment().add(16, 'day');
    }

    var result = [];
    while (!start.isSame(end, 'day')) {
      result.push({
        date: new Date(start.toDate()),
        temp: Math.floor(Math.random() * 100 % 30),
        main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 10 % 3)],
        icon: 'http://openweathermap.org/img/w/'
        + ['01d.png', '02d.png', '03d.png', '04d.png', '09d.png', '10d.png', '11d.png', '13d.png'][Math.floor(Math.random() * 100 % 8)]
      });
      start.add(1, 'day');
    }

    return result;
  };

  _.extend(WorldWeather.prototype, {
    getHistorical: mockDataGenerator,
    getForecast: mockDataGenerator
  });
}