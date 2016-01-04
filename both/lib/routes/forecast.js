Router.route('salesPrediction', {
  template: 'salesForecastMainView',
  path: '/forecast/:date/:category',
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    if (currentAreaId) {
      return [
        this.subscribe('organizationInfo'),
        this.subscribe('areaMenuItems', currentAreaId, this.params.category),
        this.subscribe('allCategories', currentAreaId),
        this.subscribe('weatherForecast', weekRange, currentAreaId),
        this.subscribe('dailySales', weekRange, currentAreaId)
      ];
    }
  },
  data: function () {
    return {
      date: HospoHero.getParamsFromRoute('date', this)
    };
  }
});

//temporal route
Router.route('forceForecast', {
  path: '/force',
  template: 'forceForecast',
  waitOn: function () {
    return this.subscribe('organizationInfo');
  }
});