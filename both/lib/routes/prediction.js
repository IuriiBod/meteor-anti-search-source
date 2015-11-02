Router.route('/roster/prediction/:year/:week/:category', {
  name: "salesPrediction",
  template: "salesPredictionPage",
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [

      this.subscribe('organizationInfo'),
      this.subscribe('areaMenuItems', currentAreaId, this.params.category),
      this.subscribe('allCategories'),
      this.subscribe('weatherForecast', weekRange, currentAreaId),
      this.subscribe('dailySales', weekRange, currentAreaId)

    ];
  },
  data: function () {
    return {
      date: HospoHero.misc.getWeekDateFromRoute(this)
    };
  }
});

//temporal route
Router.route("forceForecast", {
  path: '/forceForecast',
  template: "forceForecast",
  data: function () {
    return {};
  }
});