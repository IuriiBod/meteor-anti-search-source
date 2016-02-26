Router.route('calendar', {
  path: '/calendar/:type/:date/:userId',
  template: 'userCalendar',

  waitOn: function () {
    var userId = this.params.userId;
    var areaId = HospoHero.getCurrentAreaId();
    if (areaId) {
      return [
        Meteor.subscribe('calendarEvents', this.params.date, this.params.type, areaId, userId),
        Meteor.subscribe('sections', areaId),
        Meteor.subscribe('jobItems', null, areaId),
        Meteor.subscribe('taskList'),
        Meteor.subscribe('meetings', userId)
      ]
    }
  },

  data: function () {
    return {
      date: this.params.date,
      type: this.params.type,
      userId: this.params.userId
    };
  }
});

Router.route('managerCalendar', {
  path: '/manager-calendar/:date',
  template: 'managerCalendar',
  waitOn: function () {
    var areaId = HospoHero.getCurrentAreaId();
    var date = this.params.date;
    if (areaId) {
      return [
        Meteor.subscribe('calendarEvents', date, 'day', areaId),
        Meteor.subscribe('sections', areaId),
        Meteor.subscribe('jobItems', null, areaId),
        Meteor.subscribe('taskList'),
        Meteor.subscribe('meetings')
      ]
    }
  },
  data: function () {
    return {
      date: this.params.date
    }
  }
});