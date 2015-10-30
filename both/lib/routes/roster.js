Router.route('/roster/weekly/:year/:week', {
  name: "weeklyRoster",
  path: '/roster/weekly/:year/:week',
  template: "weeklyRosterMainView",
  waitOn: function () {
    var currentWeekDate = HospoHero.misc.getWeekDateFromRoute(this);
    var subscriptions = [
      Meteor.subscribe('weeklyRoster', currentWeekDate),
      Meteor.subscribe('workers'),
      Meteor.subscribe('sections'),
      Meteor.subscribe('areaMenuItems')
    ];

    if (HospoHero.canUser('view forecast', Meteor.userId())) {
      subscriptions.push(Meteor.subscribe('dailySales',currentWeekDate));
    }
    return subscriptions;
  },
  data: function () {
    if (!HospoHero.canUser('view roster')()) {
      Router.go("/");
    }
    return {
      weekDate: HospoHero.misc.getWeekDateFromRoute(this)
    }
  }
});

Router.route('/roster/daily/:date', {
  name: "dailyRoster",
  path: '/roster/daily/:date',
  template: "dailyRosterMainView",
  waitOn: function () {
    return [
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