//-------------------REPORTS
Router.route('/reports/stocktake/currentStocks/:year/:week', {
  name: "currentStocks",
  path: '/reports/stocktake/currentStocks/:year/:week',
  template: "currentStocksReportView",
  waitOn: function() {},
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canViewForecast()) {
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
  waitOn: function() {
    var dates = getWeekStartEnd(this.params.week);
    return [
      subs.subscribe("usersList"),
      subs.subscribe("weekly", dates, null, null)
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canViewForecast()) {
      Router.go("/");
    }
    Session.set("reportHash", this.params.hash);
    Session.set("editStockTake", false);
    Session.set("thisYear", this.params.year);
    Session.set("thisWeek", this.params.week);
  },
  fastRender: true
});