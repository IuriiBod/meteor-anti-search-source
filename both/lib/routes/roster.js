Router.route('/roster/weekly/:date', {
  name: "weeklyRoster",
  template: "weeklyRosterMainView",
  waitOn: function () {
    let currentArea = HospoHero.getCurrentArea(Meteor.userId());
    let location = currentArea && Locations.findOne({_id: currentArea.locationId});
    if (location) {
      let weekRange = TimeRangeQueryBuilder.forWeek(this.params.date, location._id);

      var subscriptions = [
        Meteor.subscribe('weeklyRoster', weekRange, currentArea._id),
        Meteor.subscribe('areaUsersList', currentArea._id),
        Meteor.subscribe('sections', currentArea._id),
        Meteor.subscribe('areaMenuItems', currentArea._id),
        Meteor.subscribe('managerNotes', weekRange, currentArea._id),
        Meteor.subscribe('leaveRequest'),
        Meteor.subscribe('taskList', Meteor.userId())
      ];


      var checker = new HospoHero.security.PermissionChecker();
      if (checker.hasPermissionInArea(currentArea._id, 'view forecast')) {
        subscriptions.push(Meteor.subscribe('dailySales', weekRange, currentArea._id));
      }
      return subscriptions;
    }
  },
  data: function () {
    return {
      date: new Date(this.params.date)
    };
  }
});


Router.route('/roster/template/weekly', {
  name: "templateWeeklyRoster",
  template: "weeklyRosterTemplateMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    if (currentAreaId) {
      return [
        Meteor.subscribe('weeklyRosterTemplate', currentAreaId),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('sections', currentAreaId)
      ];
    }
  }
});


Router.route('sectionsSettings', {
  path: '/settings/sections',
  template: 'sections',
  waitOn: function () {
    return Meteor.subscribe('sections', HospoHero.getCurrentAreaId(Meteor.userId()));
  }
});