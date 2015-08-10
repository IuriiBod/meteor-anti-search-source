Template.orderReceiveItem.events({
  'click .deliveredCorrectly': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    var receiptId = Session.get("stockReceipt");
    var status = "deliveredCorrectly";
    var info = {};
    receiveReceiptItems(id, receiptId, status, info);
  },

  'click .wrongPrice': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    var receiptId = Session.get("stockReceipt");
    var status = "wrongPrice";
    var info = {"price": 10};
    receiveReceiptItems(id, receiptId, status, info);
  },
    
  'click .wrongQuantity': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    var receiptId = Session.get("stockReceipt");
    var status = "wrongQuantity";
    var info = {"quantity": 10};
    receiveReceiptItems(id, receiptId, status, info);
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