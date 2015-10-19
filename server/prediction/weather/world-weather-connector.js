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
WorldWeather.prototype._httpQuery = function () {

};

/**
 *
 * @param date
 */
WorldWeather.prototype.getHistorical = function (date) {

};


/**
 *
 */
WorldWeather.prototype.getForecast = function () {

};