//-----------------ROSTER
Router.route('/roster/weekly/:year/:week', {
  name: "weeklyRoster",
  path: '/roster/weekly/:year/:week',
  template: "weeklyRosterMainView",
  waitOn: function () {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('weeklyRoster', {week: this.params.week, year: this.params.year}),
      Meteor.subscribe('workers'),
      Meteor.subscribe('sections'),
      Meteor.subscribe('salesPrediction'),
      Meteor.subscribe('areaMenuItems'),
      Meteor.subscribe('importedActualSales')
    ];
  },
  data: function () {
    if (!HospoHero.canUser('view roster')()) {
      Router.go("/");
    }
    return {
      week: this.params.week,
      year: this.params.year
    }
  },
  fastRender: true
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
      Meteor.subscribe('sections'),
      Meteor.subscribe('jobTypes')
    ];
  },
  data: function () {
    if (!HospoHero.canUser('view roster')()) {
      Router.go("/");
    }
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
      Meteor.subscribe('weeklyRosterTemplate'),
      Meteor.subscribe('workers'),
      Meteor.subscribe('sections')
    ];
  },
  data: function () {
    if (!HospoHero.canUser('view roster')()) {
      Router.go('/');
    }
  },
  fastRender: true
});