Router.route('/reports/stocktake/currentStocks/:year/:week', {
  name: "currentStocks",
  path: '/reports/stocktake/currentStocks/:year/:week',
  template: "currentStocksReportView",
  waitOn: function () {
    return Meteor.subscribe('ingredients', null, HospoHero.getCurrentAreaId(Meteor.userId()));
  },
  data: function () {
    Session.set("thisWeek", this.params.week);
    Session.set("editStockTake", false);
  }
});

Router.route('/reports/:year/:week', {
  name: "teamHours",
  path: "/reports/:year/:week",
  template: "teamHoursMainView",
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('usersList', currentAreaId),
      Meteor.subscribe('weeklyRoster', weekRange, currentAreaId)
    ];
  },
  data: function () {
    Session.set("reportHash", this.params.hash);
    Session.set("editStockTake", false);
    Session.set("thisYear", this.params.year);
    Session.set("thisWeek", this.params.week);
  }
});