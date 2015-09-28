var WEATHER_URL = Meteor.settings.OpenWeatherMap.HOST + '/data/2.5';
var API_KEY = Meteor.settings.OpenWeatherMap.KEY;

OpenWeatherMap = {
  _convertDtToDate: function (dt) {
    return moment(new Date(dt * 1000)).format('YYYY-MM-DD');
  },

  _convertDateToDt: function (date) {
    return date.valueOf() / 1000;
  },

  _httpGetRequest: function (route, params) {
    var defaultParams = {
      mode: 'json',
      units: 'metric',
      APPID: API_KEY
    };

    var allParams = _.extend(defaultParams, params);

    try {
      var res = HTTP.get(WEATHER_URL + route, {
        params: allParams
      });

      return res.data;
    } catch (err) {
      logger.error('OpenWeatherMap Access Error', {params: params, error: err});
      return false;
    }
  },

  forecast: function (location) {
    var data = this._httpGetRequest('/forecast/daily', {
      q: location,
      cnt: 16
    });

    var self = this;
    return data && data.list.map(function (weatherEntry) {
        return {
          date: self._convertDtToDate(weatherEntry.dt),
          temp: weatherEntry.temp.eve,
          main: weatherEntry.weather[0].main,
          icon: weatherEntry.weather[0].icon
        }
      });
  },

  history: function (date, location) {
    date.setHours(13); // get weather after 13 PM

    var data = this._httpGetRequest('/history/city', {
      q: location,
      start: this._convertDateToDt(date),
      cnt: 1
    });

    return data && data.list && data.list.length > 0 && data.list.map(function (weatherEntry) {
        return {
          temp: weatherEntry.main.temp,
          main: weatherEntry.weather[0].main
        };
      })[0];
  },

  //returns random weather
  historyMock: function (/*ignore params*/) {
    //simulate request
    Meteor._sleepForMs(100);
    return {
      temp: Math.floor(Math.random() * 100 % 60 - 30),
      main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 10 % 4)]
    }
  }
};