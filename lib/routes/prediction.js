Router.route('/roster/prediction/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var currentDate = HospoHero.dateUtils.getDateByWeekDate({year: this.params.year, week: this.params.week});
    return [
      subs.subscribe('weatherForecast', currentDate),
      subs.subscribe("salesPrediction", this.params.year, this.params.week),
      subs.subscribe('areaMenuItems'),
      subs.subscribe('importedActualSales')
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
  fastRender: true
});