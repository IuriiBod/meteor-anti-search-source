Template.inactivityTimeoutField.helpers({
  inactivityTimeout: function () {
    return StaleSession.inactivityTimeout / 60 / 1000;
  }
});


Template.inactivityTimeoutField.events({
  "change .inactivity-timeout-field": function (e) {
    FlowComponents.callAction("valueChange", e.target.value);
  }
});