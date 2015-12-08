Template.timepicker.onRendered(function () {
  var self = this;
  FlowComponents.callAction('getTime')
    .then(function (time) {
      self.$('.picker-group').datetimepicker({
        format: 'LT',
        date: time
      });
    });
});

Template.timepicker.events({
  'click .submit-time': function (event, tmpl) {
    event.preventDefault();
    var date = tmpl.$(".picker-group").data('DateTimePicker').date();
    FlowComponents.callAction('submitTime', date);
  },
  'click .cancel-edit': function (event, tmpl) {
    FlowComponents.callAction('submitTime');
  }
});