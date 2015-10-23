Router.route('/roster/prediction/:year/:week/:category', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    return [

      this.subscribe('organizationInfo'),
      this.subscribe('weatherForecast', parseInt(this.params.year), parseInt(this.params.week)),
      this.subscribe('areaMenuItems', this.params.category),
      this.subscribe('allCategories'),
      this.subscribe("dailySales", parseInt(this.params.year), parseInt(this.params.week))

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