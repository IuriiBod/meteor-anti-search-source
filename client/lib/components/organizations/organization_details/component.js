var component = FlowComponents.define("organizationDetailsPage", function(props) {});

component.state.organizationId = function() {
  return Session.get('organizationId');
};