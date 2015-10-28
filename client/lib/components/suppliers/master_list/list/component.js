var component = FlowComponents.define("suppliersList", function(props) {
});

component.state.list = function() {
  return Suppliers.find({}, {sort: {"name": 1}});
}