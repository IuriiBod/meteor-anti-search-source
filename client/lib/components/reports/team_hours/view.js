Template.teamHours.helpers({
  dayOfWeek: function (date) {
    return moment(date).format('dddd');
  },
  formatDate: function (date) {
    return moment(date).format('YYYY-MM-DD');
  }
});

Template.teamHours.events({
  'click .shiftView': function (event, tmpl) {
    FlowComponents.callAction('changeTableViewMode', 'shifts');
  },

  'click .hoursView': function (event, tmpl) {
    FlowComponents.callAction('changeTableViewMode', 'hours');
  }
});
