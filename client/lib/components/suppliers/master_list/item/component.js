var component = FlowComponents.define("suppliersItem", function(props) {
  this.supplier = props.supplier;
});

component.state.supplier = function() {
  return this.supplier;
}