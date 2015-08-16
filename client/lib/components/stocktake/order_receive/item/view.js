Template.orderReceiveItem.events({
  'click .deliveredCorrectly': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    var receiptId = Session.get("thisReceipt");
    var status = "deliveredCorrectly";
    var info = {};
    receiveReceiptItems(id, receiptId, status, info);
  },

  'click .wrongPrice': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("thisOrder", id);
    $("#updateInvoicePrice").text("Save").attr("disabled", false);
    $("#updateStockPrice").text("Save").attr("disabled", false);
    $("#wrongPriceModal").modal();
  },
    
  'click .wrongQuantity': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("thisOrder", id);
    $("#wrongQuantityModal").modal();
  }
});

function receiveReceiptItems(id, receiptId, status, info) {
  Meteor.call("receiveReceiptItems", id, receiptId, status, info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
}