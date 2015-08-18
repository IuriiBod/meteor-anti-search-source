Template.orderReceiveMainView.helpers({
  title: function() {
    var id = Session.get("thisReceipt");
    var title = "Suppleir Orders Receive";
    if(id) {
      var receipt = OrderReceipts.findOne(id);
      if(receipt && receipt.supplier) {
        title += " - [" + receipt.supplier + "]";
      }
    }
    return title;
  }
});