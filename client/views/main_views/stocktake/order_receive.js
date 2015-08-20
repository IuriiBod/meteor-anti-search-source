Template.orderReceiveMainView.helpers({
  title: function() {
    var id = Session.get("thisReceipt");
    var title = "Suppleir Orders Receive";
    if(id) {
      var receipt = OrderReceipts.findOne(id);
      if(receipt && receipt.supplier) {
        var supplier = Suppliers.findOne(receipt.supplier);
        if(supplier) {
          title += " - [" + supplier.name + "]";
        }
      }
    }
    return title;
  }
});