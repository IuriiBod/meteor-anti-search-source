Template.receiveModal.events({
  'submit #priceForm': function (event) {
    event.preventDefault();
    var price = $(event.target).find('[name=price]').val();
    var doUpdate = $(event.target).find('[name=updateStockPrice]')[0].checked;
    var receiptId = Session.get("thisReceipt");
    var orderId = Session.get("thisOrder");
    var info = {
      "price": parseFloat(price),
      "stockPriceUpdated": doUpdate
    };
    if (price && price > 0.00) {
      Meteor.call("updateOrderItems", orderId, receiptId, "Wrong Price", info, HospoHero.handleMethodResult());
    }

    var stockId = null;
    var order = StockOrders.findOne(orderId);
    if (order) {
      stockId = order.stockId;
    }
    if (doUpdate) {
      info = {
        "costPerPortion": parseFloat(price)
      };
      if (price && price > 0.00) {
        Meteor.call("editIngredient", stockId, info, HospoHero.handleMethodResult());
      }

    }

    $(event.target).find('[name=price]').val("");
    $("#wrongPriceModal").modal("hide");
  },

  'submit #quantityForm': function (event) {
    event.preventDefault();
    var invoiceQuantity = $(event.target).find('[name=invoiceQuantity]').val();

    var receiptId = Session.get("thisReceipt");
    var orderId = Session.get("thisOrder");
    var info = {
      "quantity": parseFloat(invoiceQuantity)
    };
    if (invoiceQuantity && receiptId && orderId) {
      Meteor.call("updateOrderItems", orderId, receiptId, "Wrong Quantity", info, HospoHero.handleMethodResult());
    }
    $(event.target).find('[name=invoiceQuantity]').val("");
    $("#wrongQuantityModal").modal("hide");
  }
});