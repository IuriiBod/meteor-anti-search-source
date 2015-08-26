var component = FlowComponents.define("inactivityTimeoutField", function () {

});

component.action.valueChange = function(value) {
  StaleSession.inactivityTimeout = value * 60 * 1000;
};
