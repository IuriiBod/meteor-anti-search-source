Router.route('calendar', {
  path: '/calendar/:type/:date',
  template: 'userCalendar',

  waitOn: function () {
    var userId = Meteor.userId();
    var area = HospoHero.getCurrentArea(userId);
    if (!!area) {
      var date = this.params.date;
      var queryType = this.params.type === 'day' ? 'forDay' : 'forWeek';
      return Meteor.subscribe('calendarEvents', date, queryType, area.locationId, userId);
    }
  },

  data: function () {
    return {
      date: this.params.date,
      type: this.params.type
    };
  }
});