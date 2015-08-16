Template.receiveModal.events({
  'submit #price': function(event) {
    event.preventDefault();
    var invoicePrice = $(event.target).find('[name=invoicePrice]').val();
    var stockPrice = $(event.target).find('[name=stockPrice]').val();

    var receiptId = Session.get("thisReceipt");
    var orderId = Session.get("thisOrder");
    var info = {
      "price": parseFloat(invoicePrice)
    }
    if(invoicePrice && receiptId && orderId) {
      Meteor.call("receiveReceiptItems", orderId, receiptId, "wrongPrice", info, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } 
      });
    }

    var order = StockOrders.findOne(orderId);
    var stockId = null;
    if(order) {
      stockId = order.stockId;
    }
    var info = {
      "costPerPortion": parseFloat(stockPrice)
    }
    if(stockPrice && stockId) {
      Meteor.call("editIngredient", stockId, info, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }

    $(event.target).find('[name=invoicePrice]').val("");
    $(event.target).find('[name=stockPrice]').val("");
    $("#wrongPriceModal").modal("hide");
  },

  'submit #quantity': function(event) {
    event.preventDefault();
    var invoiceQuantity = $(event.target).find('[name=invoiceQuantity]').val();

    var receiptId = Session.get("thisReceipt");
    var orderId = Session.get("thisOrder");
    var info = {
      "quantity": parseFloat(invoiceQuantity)
    }
    if(invoiceQuantity && receiptId && orderId) {
      Meteor.call("receiveReceiptItems", orderId, receiptId, "wrongQuantity", info, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } 
      });
    }

    $(event.target).find('[name=invoiceQuantity]').val("");
    $("#wrongQuantityModal").modal("hide");
  },
});