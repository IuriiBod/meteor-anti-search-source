var component = FlowComponents.define('jobItemsList', function(props) {
  this.type = props.id;
});
component.state.type = function() {
  return this.type;
};

component.state.showSection = function() {
  var id = this.type;
  var type = JobTypes.findOne(id);
  return !!(type && type.name == "Recurring");
};