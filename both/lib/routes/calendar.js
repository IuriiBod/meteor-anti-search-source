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