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

  'click .receiveOrderItem': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("editable" + id, false);
    var receiptId = Session.get("thisReceipt");
    Meteor.call("receiveOrderItems", id, receiptId, {"received": true}, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .editPermitted': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("editable" + id, true);
  }
});

function receiveReceiptItems(id, receiptId, status, info) {
  var order = StockOrders.findOne(id);
  if(order) {
    Meteor.call("updateOrderItems", id, receiptId, status, info, function(err) {
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