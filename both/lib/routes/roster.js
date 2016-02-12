Router.route('/roster/weekly/:date', {
  name: "weeklyRoster",
  template: "weeklyRosterMainView",
  waitOn: function () {
    var weekRange = HospoHero.misc.getWeekRangeQueryByRouter(this);
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    var subscriptions = [
      Meteor.subscribe('weeklyRoster', weekRange, currentAreaId),
      Meteor.subscribe('areaUsersList', currentAreaId),
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
    return {
      date: new Date(this.params.date)
    }
  }
});


Router.route('/roster/template/weekly', {
  name: "templateWeeklyRoster",
  template: "weeklyRosterTemplateMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('weeklyRosterTemplate', currentAreaId),
      Meteor.subscribe('areaUsersList', currentAreaId),
      Meteor.subscribe('sections', currentAreaId)
    ];
  }
});