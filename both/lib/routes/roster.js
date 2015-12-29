Router.route('/roster/weekly/:date', {
  name: "weeklyRoster",
  template: "weeklyRosterMainView",
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    var subscriptions = [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe('weeklyRoster', weekRange, currentAreaId),
      Meteor.subscribe('workers', currentAreaId),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('areaMenuItems', currentAreaId),
      Meteor.subscribe('managerNotes', weekRange, currentAreaId),
      Meteor.subscribe('leaveRequest')
    ];

    if (HospoHero.canUser('view forecast', Meteor.userId())) {
      subscriptions.push(Meteor.subscribe('dailySales', weekRange, currentAreaId));
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