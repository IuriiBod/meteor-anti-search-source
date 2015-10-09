Router.route('/roster/prediction/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var currentDate = HospoHero.dateUtils.getDateByWeekDate({year: this.params.year, week: this.params.week});
    //subs.clear();
    return [
      subs.subscribe('weatherForecast', currentDate),
      subs.subscribe("salesPrediction"),
      Meteor.subscribe('areaMenuItems'),
      subs.subscribe('importedActualSales'),

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