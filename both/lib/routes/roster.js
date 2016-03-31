Router.route('/roster/weekly/:date', {
  name: 'weeklyRoster',
  template: 'weeklyRoster',
  waitOn: function () {
    let area = HospoHero.getCurrentArea();
    if (area) {
      let currentAreaId = area._id;
      let weekRange = TimeRangeQueryBuilder.forWeek(this.params.date, area.locationId, 'YYYY-MM-DD');
      let subscriptions = [
        Meteor.subscribe('weeklyRoster', weekRange, currentAreaId),
        Meteor.subscribe('managerNotes', weekRange, currentAreaId),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('sections', currentAreaId),
        Meteor.subscribe('areaMenuItems', currentAreaId),
        Meteor.subscribe('leaveRequest'),
        Meteor.subscribe('taskList', Meteor.userId())
      ];

      let checker = new HospoHero.security.PermissionChecker();
      if (checker.hasPermissionInArea(currentAreaId, 'view forecast')) {
        subscriptions.push(Meteor.subscribe('dailySales', weekRange, currentAreaId));
      }
      return subscriptions;
    }
  },
  data: function () {
    return {
      type: null,
      localMoment: HospoHero.dateUtils.getDateMomentForLocation(this.params.date)
    };
  }
});


Router.route('/roster/template/weekly', {
  name: 'templateWeeklyRoster',
  template: 'weeklyRoster',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId();
    if (currentAreaId) {
      return [
        Meteor.subscribe('weeklyRosterTemplate', currentAreaId),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('sections', currentAreaId)
      ];
    }
  },
  data: function () {
    let localMoment = HospoHero.dateUtils.getDateMomentForLocation(0);
    return {
      type: 'template',
      // 0 means new Date(0) (date with 0 timestamp)
      localMoment: localMoment.week(2).startOf('isoweek')
    };
  }
});


Router.route('sectionsSettings', {
  path: '/settings/sections',
  template: 'sections',
  waitOn: function () {
    return Meteor.subscribe('sections', HospoHero.getCurrentAreaId(Meteor.userId()));
  }
});