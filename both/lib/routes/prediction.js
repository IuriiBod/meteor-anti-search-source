Router.route('/forecast/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var currentWeekDate = HospoHero.misc.getWeekDateFromRoute(this);
    return [
      this.subscribe('organizationInfo'),
      this.subscribe('weatherForecast', currentWeekDate),
      this.subscribe('dailySales', currentWeekDate)
    ];
  },
  data: function () {
    return {
      date: {
        year: this.params.year,
        week: this.params.week
      }
    };
  },
});