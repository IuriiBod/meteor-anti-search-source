Router.route('/roster/prediction/:year/:week/:category', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var currentWeekDate = HospoHero.misc.getWeekDateFromRoute(this);
    return [
      this.subscribe('organizationInfo'),
      this.subscribe('weatherForecast', HospoHero.misc.getWeekDateFromRoute(this)),
      this.subscribe('areaMenuItems', this.params.category),
      this.subscribe('allCategories'),
      this.subscribe("dailySales", HospoHero.misc.getWeekDateFromRoute(this))
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