Router.route('/roster/prediction/:year/:week', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('weatherForecast', parseInt(this.params.year), parseInt(this.params.week)),
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