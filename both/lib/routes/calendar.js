Router.route('calendar', {
  path: '/calendar/:type/:date/:userId',
  template: 'userCalendar',

  waitOn: function () {
    var userId = this.params.userId;
    var area = HospoHero.getCurrentArea();
    if (!!area) {
      return [
        Meteor.subscribe('calendarEvents', this.params.date, this.params.type, area.locationId, userId),
        Meteor.subscribe('sections', area._id),
        Meteor.subscribe('jobItems', null, area._id),
        Meteor.subscribe('taskList')
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
    var area = HospoHero.getCurrentArea();
    var date = this.params.date;
    if (!!area) {
      return [
        Meteor.users.find().map(function (user) {
          return Meteor.subscribe('calendarEvents', date, 'day', area.locationId, user._id);
        }),
        Meteor.subscribe('sections', area._id),
        Meteor.subscribe('jobItems', null, area._id),
        Meteor.subscribe('taskList')
      ]
    }
  },
  data: function () {
    return {
      date: this.params.date
    }
  }
});