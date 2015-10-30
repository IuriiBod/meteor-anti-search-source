Router.route('/forecast/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var currentWeekDate = HospoHero.misc.getWeekDateFromRoute(this);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      this.subscribe('weatherForecast', currentWeekDate, currentAreaId),
      this.subscribe('dailySales', currentWeekDate, currentAreaId)
    ];
  },
  data: function () {
    return {
      date: {
        year: this.params.year,
        week: this.params.week
      }
    };
  }
});