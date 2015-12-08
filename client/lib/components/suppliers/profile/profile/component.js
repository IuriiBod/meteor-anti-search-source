var component = FlowComponents.define("supplierProfile", function (props) {
});

component.state.supplierId = function () {
  return Session.get("thisSupplier");
}