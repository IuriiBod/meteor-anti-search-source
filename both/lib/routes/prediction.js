Router.route('/roster/prediction/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var currentDate = HospoHero.dateUtils.getDateByWeekDate({year: this.params.year, week: this.params.week});
    console.log('forecast date', currentDate);
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('weatherForecast', currentDate),
      Meteor.subscribe("salesPrediction"),
      Meteor.subscribe('areaMenuItems'),
      Meteor.subscribe('importedActualSales')
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