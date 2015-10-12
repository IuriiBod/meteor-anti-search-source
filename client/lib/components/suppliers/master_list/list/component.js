var component = FlowComponents.define("suppliersList", function(props) {
  Meteor.subscribe("allSuppliers");
});

component.state.list = function() {
  return Suppliers.find({}, {sort: {"name": 1}});
}