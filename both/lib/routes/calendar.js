Router.route('calendar', {
  path: '/calendar/:type/:date/:userId',
  template: 'userCalendar',

  waitOn: function () {
    var userId = this.params.userId;
    var area = HospoHero.getCurrentArea(userId);
    if (!!area) {
      return [
        Meteor.subscribe('calendarEvents', this.params.date, this.params.type, area.locationId, userId),
        Meteor.subscribe('sections', area._id)
      ];
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
          return [
            Meteor.subscribe('calendarEvents', date, 'day', area.locationId, user._id),
            Meteor.subscribe('shifts', 'today', user._id, area._id, new Date(date))
          ]
        }),
        Meteor.subscribe('sections', area._id)
      ];
    }
  },
  data: function () {
    return {
      date: this.params.date
    }
  }
});