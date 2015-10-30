//-------------------REPORTS
Router.route('/reports/stocktake/currentStocks/:year/:week', {
  name: "currentStocks",
  path: '/reports/stocktake/currentStocks/:year/:week',
  template: "currentStocksReportView",
  waitOn: function () {
    return Meteor.subscribe('ingredients', null, HospoHero.getCurrentAreaId(Meteor.userId()));
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.canUser('edit roster')()) {
      Router.go("/");
    }
    Session.set("thisWeek", this.params.week);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/reports/:year/:week', {
  name: "teamHours",
  path: "/reports/:year/:week",
  template: "teamHoursMainView",
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    return [
      Meteor.subscribe('usersList', HospoHero.getCurrentAreaId(Meteor.userId())),
      Meteor.subscribe('weeklyRoster', weekRange)
    ];
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.canUser('edit roster')()) {
      Router.go("/");
    }
    Session.set("reportHash", this.params.hash);
    Session.set("editStockTake", false);
    Session.set("thisYear", this.params.year);
    Session.set("thisWeek", this.params.week);
  },
  fastRender: true
});