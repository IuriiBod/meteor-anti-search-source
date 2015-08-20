Template.receiveModal.events({
  'submit #priceForm': function(event) {
    event.preventDefault();
    var price = $(event.target).find('[name=price]').val();
    var doUpdate = $(event.target).find('[name=updateStockPrice]')[0].checked;
    console.log(".....", price, doUpdate);
    price = price.substring(1);
    price = price.replace(/[, ]+/g, "").trim();

    var receiptId = Session.get("thisReceipt");
    var orderId = Session.get("thisOrder");
    var info = {
      "price": parseFloat(price)
    }
    if(price && price > 0.00) {
      Meteor.call("receiveReceiptItems", orderId, receiptId, "Wrong Price", info, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }

    var stockId = null;
    var order = StockOrders.findOne(orderId);
    if(order) {
      stockId = order.stockId;
    }
    if(doUpdate) {
      var info = {
        "costPerPortion": parseFloat(price)
      }
      if(price && price > 0.00) {
        Meteor.call("editIngredient", stockId, info, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
      
    }

    $(event.target).find('[name=price]').val("");
    $("#wrongPriceModal").modal("hide");
  },

  'submit #quantityForm': function(event) {
    event.preventDefault();
    var invoiceQuantity = $(event.target).find('[name=invoiceQuantity]').val();

    var receiptId = Session.get("thisReceipt");
    var orderId = Session.get("thisOrder");
    var info = {
      "quantity": parseFloat(invoiceQuantity)
    }
    if(invoiceQuantity && receiptId && orderId) {
      Meteor.call("receiveReceiptItems", orderId, receiptId, "Wrong Quantity", info, function(err) {
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