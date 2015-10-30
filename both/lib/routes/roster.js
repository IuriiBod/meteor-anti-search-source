Router.route('/roster/weekly/:year/:week', {
  name: "weeklyRoster",
  path: '/roster/weekly/:year/:week',
  template: "weeklyRosterMainView",
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    var subscriptions = [
      Meteor.subscribe('weeklyRoster', weekRange),
      Meteor.subscribe('workers', currentAreaId),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('areaMenuItems', currentAreaId)
    ];

    if (HospoHero.canUser('view forecast', Meteor.userId())) {
      subscriptions.push(Meteor.subscribe('dailySales',weekRange));
    }
    return subscriptions;
  },
  data: function () {
    if (!HospoHero.canUser('view roster', Meteor.userId())) {
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
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('daily', this.params.date, currentAreaId, null),
      Meteor.subscribe('workers', currentAreaId),
      Meteor.subscribe('jobs', currentAreaId, 'unassigned'),
      Meteor.subscribe('jobItems', null, currentAreaId),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('jobTypes')
    ];
  },
  data: function () {
    if (!HospoHero.canUser('view roster', Meteor.userId())) {
      Router.go("/");
    }
  }
});


Router.route('/roster/template/weekly', {
  name: "templateWeeklyRoster",
  path: '/roster/template/weekly',
  template: "weeklyRosterTemplateMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('weeklyRosterTemplate', currentAreaId),
      Meteor.subscribe('workers', currentAreaId),
      Meteor.subscribe('sections', currentAreaId)
    ];
  },
  data: function () {
    if (!HospoHero.canUser('view roster', Meteor.userId())) {
      Router.go('/');
    }
  }
});