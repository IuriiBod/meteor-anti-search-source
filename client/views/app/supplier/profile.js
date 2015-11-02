Template.supplierProfileMainView.helpers({
  name: function() {
    var id = Session.get("thisSupplier");
    if(id) {
      var supplier = Suppliers.findOne(id);
      if(supplier) {
        return supplier.name;
      }
    }
  }
});