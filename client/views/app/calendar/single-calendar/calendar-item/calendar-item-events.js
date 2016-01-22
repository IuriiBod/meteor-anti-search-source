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
    tmpl.calendarType = 'day';
    tmpl.changeDate();
  },

  'click .fc-agendaWeek-button': function (event, tmpl) {
    tmpl.calendarType = 'week';
    tmpl.changeDate();
  }
});