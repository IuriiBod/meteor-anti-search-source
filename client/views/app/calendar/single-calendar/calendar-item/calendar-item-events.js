Template.calendarItem.events({
  'click .fc-prev-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.changeDate('subtract', 1);
  },

  'click .fc-next-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.changeDate('add', 1);
  },

  'click .fc-agendaDay-button': function (event, tmpl) {
    tmpl.calendarView = 'day';
  },

  'click .fc-agendaWeek-button': function (event, tmpl) {
    tmpl.calendarView = 'week';
  }
});