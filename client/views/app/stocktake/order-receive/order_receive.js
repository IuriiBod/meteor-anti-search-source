Template.orderReceiveMainView.helpers({
  title: function () {
    var id = this.currentReceipt;
    var title = "Supplier Orders Receive";
    if (id) {
      var receipt = OrderReceipts.findOne({_id: id});
      if (receipt && receipt.supplier) {
        //Meteor.subscribe("suppliers", [receipt.supplier]);
        var supplier = Suppliers.findOne({_id: receipt.supplier});
        if (supplier) {
          title += " - [" + supplier.name + "]";
        }
      }
    }
    return title;
  }
});