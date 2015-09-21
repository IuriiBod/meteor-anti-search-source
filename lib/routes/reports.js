//-------------------REPORTS
Router.route('/reports/stocktake/currentStocks/:year/:week', {
  name: "currentStocks",
  path: '/reports/stocktake/currentStocks/:year/:week',
  template: "currentStocksReportView",
  waitOn: function() {
    var cursors = [];
    return cursors;
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
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
    return [
      subs.subscribe("usersList"),
      weeklySubs(this.params.week, null)
    ];
  },
  data: function() {
    if(!Meteor.userId() || !isManagerOrAdmin(Meteor.userId())) {
      Router.go("/");
    }
    Session.set("reportHash", this.params.hash)
    Session.set("editStockTake", false);
    Session.set("thisYear", this.params.year);
    Session.set("thisWeek", this.params.week);
  },
  fastRender: true
});

function weeklySubs(week, type) {
  var dates = getWeekStartEnd(week);
  return subs.subscribe("weekly", dates, null, type);
}