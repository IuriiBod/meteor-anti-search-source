//todo: implement methods, write docs

/**
 * Api key should be stored in app's settings
 * @param country
 * @param city
 * @constructor
 */
WorldWeather = function WorldWeather(country, city) {
  this._country = country;
  this._city = city;
};

/**
 * Base method used to access world weather API
 * @private
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
 *
 * @param date
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
 *
 */
WorldWeather.prototype.getForecast = function () {
  var today = moment().format("YYYY-MM-DD");
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