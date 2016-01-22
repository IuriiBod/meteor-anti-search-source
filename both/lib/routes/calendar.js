Router.route('calendar', {
  path: '/calendar/:date',
  template: 'userCalendar',

  waitOn: function () {
    var userId = Meteor.userId();
    var areaId = HospoHero.getCurrentAreaId(userId);
    var date = this.params.date;
    return [
      //Meteor.subscribe('recurringJobItems', areaId, userId, date)
    ];
  },

  data: function () {
    return {
      date: this.params.date
    };
  }
});