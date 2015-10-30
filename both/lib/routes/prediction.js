Router.route('/forecast/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    return [
      this.subscribe('organizationInfo'),
      this.subscribe('weatherForecast', weekRange),
      this.subscribe('dailySales', weekRange)
    ];
  },
  data: function () {
    return {
      date: HospoHero.misc.getWeekDateFromRoute(this)
    };
  },
});