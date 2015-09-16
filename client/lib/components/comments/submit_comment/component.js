var component = FlowComponents.define("submitComment", function(props) {
  this.referenceId = props.id;
  this.refType = props.type;
});

component.state.doc = function() {
  return this;
}