Router.route('/forecast/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var currentWeekDate = HospoHero.misc.getWeekDateFromRoute(this);
    return [
      this.subscribe('weatherForecast', currentWeekDate, HospoHero.getCurrentAreaId(Meteor.userId())),
      this.subscribe('dailySales', currentWeekDate, HospoHero.getCurrentAreaId(Meteor.userId()))
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