//-----------------ROSTER
Router.route('/roster/weekly/:year/:week', {
  name: "weeklyRoster",
  path: '/roster/weekly/:year/:week',
  template: "weeklyRosterMainView",
  waitOn: function () {
    if (this.params.week != null) {
      var week = getWeekStartEnd(this.params.week, this.params.year);
      return [
        Meteor.subscribe('organizationInfo'),
        Meteor.subscribe('weekly', week, null, null),
        Meteor.subscribe('workers'),
        Meteor.subscribe('sections'),
        Meteor.subscribe('areaMenuItems'),
        Meteor.subscribe('dailySales')
      ];
    }
  },
  data: function () {
    if (!HospoHero.perms.canUser('viewRoster')()) {
      Router.go("/");
    }
    Session.set("thisWeek", this.params.week);
    Session.set("thisYear", this.params.year);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/roster/daily/:date', {
  name: "dailyRoster",
  path: '/roster/daily/:date',
  template: "dailyRosterMainView",
  waitOn: function () {
    if (this.params.date != null) {
      return [
        Meteor.subscribe('organizationInfo'),
        Meteor.subscribe('daily', this.params.date, null),
        Meteor.subscribe('workers'),
        Meteor.subscribe('jobs', 'unassigned'),
        Meteor.subscribe('jobItems'),
        Meteor.subscribe('sections'),
        Meteor.subscribe('jobTypes')
      ];
    }
  },
  data: function () {
    if (!HospoHero.perms.canUser('viewRoster')()) {
      Router.go("/");
    }
    Session.set("thisDate", this.params.date);
    Session.set("editStockTake", false);
  },
  fastRender: true
});


Router.route('/roster/template/weekly', {
  name: "templateWeeklyRoster",
  path: '/roster/template/weekly',
  template: "weeklyRosterTemplateMainView",
  waitOn: function () {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('weekly', null, null, 'template'),
      Meteor.subscribe('workers'),
      Meteor.subscribe('sections')
    ];
  },
  data: function () {
    if (!HospoHero.perms.canUser('viewRoster')()) {
      Router.go('/');
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});