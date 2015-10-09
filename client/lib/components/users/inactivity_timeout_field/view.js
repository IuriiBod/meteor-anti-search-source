Template.inactivityTimeoutField.helpers({
  inactivityTimeout: function () {
    return StaleSession.inactivityTimeout / 60000;
  }
});


Template.inactivityTimeoutField.events({
  "change .inactivity-timeout-field": function (e) {
    FlowComponents.callAction("valueChange", parseInt(e.target.value));
  }
});