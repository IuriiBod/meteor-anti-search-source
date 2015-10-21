Router.route('/roster/prediction/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    return [
      this.subscribe('organizationInfo'),
      this.subscribe('weatherForecast', parseInt(this.params.year), parseInt(this.params.week)),
      this.subscribe("salesPrediction"),
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
});