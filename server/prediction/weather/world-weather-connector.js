//todo: implement methods, write docs

/**
 * Api key should be stored in app's settings
 * @param {String} country
 * @param {String} city
 * @constructor
 */
WorldWeather = function WorldWeather(country, city) {
  this._country = country;
  this._city = city;
};

/**
 * Base method used to access world weather API
 * @private
 * @param {String} route API route for WorldWeather (weather, past-weather)
 * @param {Object} params Parameters for request (location, dates)
 * @return {Object|Boolean} Returns object with weather date. If request failed returns false
 */
WorldWeather.prototype._httpQuery = function (route, params) {
  var defaultParams = {
    format: "json",
    tp:3,
    key: Meteor.settings.WorldWeather.KEY
  };

  var allParams = _.extend(defaultParams, params);
  try {
    var url = Meteor.settings.WorldWeather.HOST;
    var res = HTTP.get(url + route, {
      params: allParams
    });
    return res.data;
  } catch (err) {
    logger.error('WorldWeather Access Error', {params: params, error: err});
    return false;
  }
};

/**
 *Method used to get past weather for a given interval
 * @param {Date|String} fromDate
 * @param {Date|String} toDate
 * @return {Array} Return an array of objects of formated weather data.
 */
WorldWeather.prototype.getHistorical = function (fromDate, toDate) {
  var startDate = moment(fromDate).format("YYYY-MM-DD");
  var endDate = moment(toDate).format("YYYY-MM-DD");
  var data = this._httpQuery("past-weather.ashx",{
    q:this._city+","+this._country,
    date: startDate,
    endDate: endDate
  });
  var res = [];
  _.each(data.data.weather, function (item) {
    res.push({
      date: item.date,
      temp: item.hourly[5].tempC,
      main: item.hourly[5].weatherDesc[0].value
    });
  });
  return res;
};


/**
 *Method used to get weather forecast for 15 days
 * @return {Array} Return an array of objects of formated weather data.
 */
WorldWeather.prototype.getForecast = function () {
  var data = this._httpQuery("weather.ashx",{
    q:this._city+","+this._country
  });
  var res = [];
  _.each(data.data.weather, function (item) {
    res.push({
      date: item.date,
      temp: item.hourly[5].tempC,
      main: item.hourly[5].weatherDesc[0].value,
      icon: item.hourly[5].weatherIconUrl[0].value
    });
  });
  return res;
};