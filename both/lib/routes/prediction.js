Router.route('/roster/prediction/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var currentDate = HospoHero.dateUtils.getDateByWeekDate({year: this.params.year, week: this.params.week});
    return [
      this.subscribe('organizationInfo'),
      this.subscribe('weatherForecast', currentDate),
      this.subscribe("salesPrediction"),
      this.subscribe('areaMenuItems'),
      this.subscribe('importedActualSales')
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