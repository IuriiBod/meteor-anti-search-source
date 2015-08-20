Template.orderReceiveItem.events({
  'click .deliveredCorrectly': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    var receiptId = Session.get("thisReceipt");
    var status = "Delivered Correctly";
    var info = {};
    receiveReceiptItems(id, receiptId, status, info);
  },

  'click .wrongPrice': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("thisOrder", id);
    $("#wrongPriceModal").modal();
  },
    
  'click .wrongQuantity': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("thisOrder", id);
    $("#wrongQuantityModal").modal();
  },

  'click .setEditable': function(event) {
    event.preventDefault();
    // $(event.target).hide();
    // $(event.target).
  }
});

function receiveReceiptItems(id, receiptId, status, info) {
  var order = StockOrders.findOne(id);
  if(order) {
    Meteor.call("receiveReceiptItems", id, receiptId, status, info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        var date = moment().format("YYYY-MM-DD");
        Meteor.call("updateCurrentStock", order.stockId, "Stock receive", order.countOrdered, new Date(date), function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    });
  }
}