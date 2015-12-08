Template.reportData.events({
  'click .start-time': function (event, tmpl) {
    FlowComponents.callAction('toggleEditStartTime');
  },

  'click .end-time': function (event, tmpl) {
    FlowComponents.callAction('toggleEditEndTime');
  },

  'click .stopCurrentShift': function (event) {
    event.preventDefault();
    var confirmClockout = confirm("Are you sure you want to clockout this shift ?");
    if (confirmClockout) {
      FlowComponents.callAction('clockOut');
    }
  }
});