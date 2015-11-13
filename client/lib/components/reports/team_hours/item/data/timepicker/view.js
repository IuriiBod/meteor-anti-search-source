Template.timepicker.onRendered(function () {
  this.$('.picker-group').datetimepicker({
    format: 'LT',
    date: moment()
  });
});

Template.timepicker.events({
  'click .submit-time': function (event, tmpl) {
    event.preventDefault();
    var date = tmpl.$(".picker-group").data('DateTimePicker').date();
    FlowComponents.callAction('submitTime', date);
  },
  'click .cancel-edit': function (event, tmpl){
    FlowComponents.callAction('submitTime');
  }
});