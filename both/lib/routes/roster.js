Router.route('/roster/weekly/:year/:week', {
  name: "weeklyRoster",
  path: '/roster/weekly/:year/:week',
  template: "weeklyRosterMainView",
  waitOn: function () {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('weeklyRoster', HospoHero.misc.getWeekDateFromRoute(this)),
      Meteor.subscribe('workers'),
      Meteor.subscribe('sections', HospoHero.getCurrentAreaId(Meteor.userId())),
      Meteor.subscribe('areaMenuItems'),
      Meteor.subscribe('dailySales')
    ];
  },
  data: function () {
    if (!HospoHero.canUser('view roster')()) {
      Router.go("/");
    }
    return {
      weekDate:  HospoHero.misc.getWeekDateFromRoute(this)
    }
  }
});

Router.route('/roster/daily/:date', {
  name: "dailyRoster",
  path: '/roster/daily/:date',
  template: "dailyRosterMainView",
  waitOn: function () {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('daily', this.params.date, null),
      Meteor.subscribe('workers'),
      Meteor.subscribe('jobs', 'unassigned'),
      Meteor.subscribe('jobItems'),
      Meteor.subscribe('sections', HospoHero.getCurrentAreaId(Meteor.userId())),
      Meteor.subscribe('jobTypes')
    ];
  },
  data: function () {
    if (!HospoHero.canUser('view roster')()) {
      Router.go("/");
    }
  }
});


Router.route('/roster/template/weekly', {
  name: "templateWeeklyRoster",
  path: '/roster/template/weekly',
  template: "weeklyRosterTemplateMainView",
  waitOn: function () {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('weeklyRosterTemplate'),
      Meteor.subscribe('workers'),
      Meteor.subscribe('sections', HospoHero.getCurrentAreaId(Meteor.userId())),
    ];
  },
  data: function () {
    if (!HospoHero.canUser('view roster')()) {
      Router.go('/');
    }
  }
});