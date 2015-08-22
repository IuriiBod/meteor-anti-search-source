var component = FlowComponents.define("suppliersList", function(props) {
  subs.subscribe("allSuppliers");
});

component.state.list = function() {
  return Suppliers.find();
}