//-----------------ROSTER

Router.route('/roster/daily/:date', {
  name: "dailyRoster",
  path: '/roster/daily/:date',
  template: "dailyRosterMainView",
  waitOn: function() {
    if(this.params.date != null) {
      return [
        Meteor.subscribe("daily", this.params.date, null),
        subs.subscribe("workers"),
        subs.subscribe("unAssignedJobs"),
        subs.subscribe("allJobItems"),
        subs.subscribe("allSections"),
        subs.subscribe("jobTypes"),

      ];
    }
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisDate", this.params.date);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/roster/weekly/:year/:week', {
  name: "weeklyRoster",
  path: '/roster/weekly/:year/:week',
  template: "weeklyRosterMainView",
  waitOn: function() {
    if(this.params.week != null) {
      var week = getWeekStartEnd(this.params.week, this.params.year);
      return [
        weeklySubs(this.params.week, null),
        subs.subscribe("workers"),
        subs.subscribe("allSections"),
        subs.subscribe("salesForecastForWeek", week.monday, week.sunday, "cafe"),
        subs.subscribe("actualSalesForWeek", week.monday, week.sunday, "cafe")
      ];
    }
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisWeek", this.params.week);
    Session.set("thisYear", this.params.year);
    Session.set("editStockTake", false);
  },
  fastRender: true
});


Router.route('/roster/template/weekly', {
  name: "templateWeeklyRoster",
  path: '/roster/template/weekly',
  template: "weeklyRosterTemplateMainView",
  waitOn: function() {
    return [
      subs.subscribe("weekly", null, null, "template"),
      subs.subscribe("workers"),
      subs.subscribe("allSections")
    ];
  },
  data: function() {
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/roster/shift/:_id', {
  name: "shift",
  path: '/roster/shift/:_id',
  template: "shiftMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("shift", this.params._id));
    var shift = Shifts.findOne(this.params._id);
    var jobs = [];
    if(shift && shift.jobs.length > 0) {
      jobs = shift.jobs;
      cursors.push(subs.subscribe("jobs", jobs));
    }
    if(shift && shift.assignedTo) {
      cursors.push(subs.subscribe("profileUser", shift.assignedTo))
    }
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
    Session.set("thisDate", this.params.date);
  },
  fastRender: true
});

function weeklySubs(week, type) {
  var dates = getWeekStartEnd(week);
  return subs.subscribe("weekly", dates, null, type);
}