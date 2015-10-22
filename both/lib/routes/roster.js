//-----------------ROSTER
Router.route('/roster/weekly/:year/:week', {
  name: "weeklyRoster",
  path: '/roster/weekly/:year/:week',
  template: "weeklyRosterMainView",
  waitOn: function () {
    var date = HospoHero.dateUtils.getDateByWeekDate({week: this.params.week, year: this.params.year});
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('weeklyRoster', date),
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

Router.route('/roster/shift/:shiftId', {
  name: "shift",
  path: '/roster/shift/:shiftId',
  template: "shiftMainView",
  waitOn: function () {
    return [
      Meteor.subscribe('shiftDetails', this.params.shiftId),
      Meteor.subscribe('organizationInfo')
    ]
  },
  data: function () {
    if (!HospoHero.canUser('view roster')()) {
      Router.go('/');
    }
  },
  fastRender: true
});