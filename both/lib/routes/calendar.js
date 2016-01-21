Router.route('calendar', {
  path: '/calendar/:date',
  template: 'userCalendar',

  data: function () {
    return {
      date: this.params.date
    };
  }
});