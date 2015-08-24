var component = FlowComponents.define("basics", function(props) {});

component.state.basics = function() {
  var id = Session.get("thisSupplier");
  if(id) {
    var supplier = Suppliers.findOne(id);
    if(supplier) {
      return supplier;
    }
  }
}

component.state.status = function() {
  var id = Session.get("thisSupplier");
  if(id) {
    var supplier = Suppliers.findOne(id);
    if(supplier) {
      if(supplier.active) {
        return true;
      }
    } 
  }
}