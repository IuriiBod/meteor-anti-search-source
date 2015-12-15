Template.receiveModal.onRendered(function() {
  $('[data-toggle="popover"]').popover();
  $('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.receiveModal.helpers({
  isWrongPrice: function() {
    if (this.name == "wrongPrice") {
      return true;
    }
  },

  isWrongQuantity: function() {
    if (this.name == "wrongQuantity") {
      return true;
    }
  }
});

Template.receiveModal.events({
  'submit #priceForm': function (event, tmpl) {
    event.preventDefault();
    var price = $(event.target).find('[name=price]').val();
    var doUpdate = $(event.target).find('[name=updateStockPrice]')[0].checked;
    var receiptId = tmpl.data.receipt;
    var orderId = tmpl.data.order;
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

  'submit #quantityForm': function (event, tmpl) {
    event.preventDefault();
    var invoiceQuantity = $(event.target).find('[name=invoiceQuantity]').val();
    var receiptId = tmpl.data.receipt;
    var orderId = tmpl.data.order;
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