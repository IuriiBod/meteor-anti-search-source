/**
 * Api key should be stored in app's settings
 * @param {String} country
 * @param {String} city
 * @constructor
 */
WorldWeather = function WorldWeather(country, city) {
  this._country = country;
  this._city = city;
  this._defaultParams = {
    format: "json",
    tp: 3,
    key: Meteor.settings.WorldWeather.KEY
  };
  this._url = Meteor.settings.WorldWeather.HOST;
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
    q: this._city + "," + this._country,
    date: startDate,
    endDate: endDate
  });

  return data.data.weather.map(function (item) {
    return {
      date: item.date,
      temp: item.hourly[5].tempC,
      main: item.hourly[5].weatherDesc[0].value
    };
  });
};

/**
 * Method used to get weather forecast for 15 days
 *
 * @return {Array} Return an array of objects of formated weather data.
 */
WorldWeather.prototype.getForecast = function () {
  var data = this._httpQuery("weather.ashx", {
    q: this._city + "," + this._country
  });

  return data.data.weather.map(function (item) {
    return {
      date: item.date,
      temp: item.hourly[5].tempC,
      main: item.hourly[5].weatherDesc[0].value,
      icon: item.hourly[5].weatherIconUrl[0].value
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
    q: this._city + "," + this._country
  });
  return !!data.data.error
};