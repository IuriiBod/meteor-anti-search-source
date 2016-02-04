Router.route('calendar', {
  path: '/calendar/:type/:date',
  template: 'userCalendar',

  waitOn: function () {
    var userId = Meteor.userId();
    var area = HospoHero.getCurrentArea(userId);
    if (!!area) {
      var date = this.params.date;
      return [
        Meteor.subscribe('calendarEvents', date, this.params.type, area.locationId, userId),
        Meteor.subscribe('sections', area._id)
      ];
    }
  },

  data: function () {
    return {
      date: this.params.date,
      type: this.params.type
    };
  }
});