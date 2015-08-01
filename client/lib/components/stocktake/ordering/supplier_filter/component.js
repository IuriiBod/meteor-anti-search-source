var component = FlowComponents.define("supplierFilter", function(props) {});

component.state.suppliers = function() {
  var ordersList = OrdersPlaced.find({"stocktakeDate": Session.get("thisDate")});
  var supplierslist = [];
  ordersList.forEach(function(order) {
    if(order.supplier) {
      if(supplierslist.indexOf(order.supplier) < 0) {
        supplierslist.push(order.supplier);
      }
    }
  });
  return supplierslist;
}

component.state.activeSupplier = function() {
  return Session.get("activeSupplier");
}

component.state.thisSupplierActive = function(id) {
  var active = Session.get("activeSupplier");
  if(active == id) {
    return true;
  } else {
    return false;
  }
}