Namespace('HospoHero', {
  isDevelopmentMode: function () {
    return process.env.NODE_ENV === 'development';
  },

  getMillisecondsFromDays: function (days) {
    return days * 24 * 60 * 60 * 1000;
  }
});