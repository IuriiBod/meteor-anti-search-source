var component = FlowComponents.define("organizationDetailsPage", function(props) {
  this.organizationId = props.organizationId;
});

component.state.organizationId = function() {
  return this.organizationId;
};