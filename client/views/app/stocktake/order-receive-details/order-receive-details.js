Template.orderReceiveDetails.helpers({
  title: function () {
    var receipt = this.currentReceipt;
    var title = "Supplier Orders Receive";
    if (receipt && receipt.supplier) {
      var supplier = Suppliers.findOne({_id: receipt.supplier});
      if (supplier) {
        title += " - [" + supplier.name + "]";
      }
    }
    return title;
  }
});