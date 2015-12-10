Template.orderReceiveItem.helpers({
  stock: function () {
    var ingredient = Ingredients.findOne(this.item.stockId);
    if (ingredient) {
      this.item['description'] = ingredient.description;
    }
    return this.item;
  },

  total: function () {
    var total = 0;
    var quantity = this.item.countOrdered;
    if (this.item.hasOwnProperty("countDelivered")) {
      quantity = this.item.countDelivered;
    }
    total = this.item.unitPrice * quantity;
    return total;
  },

  deliveryStatus: function() {
    var id = this.item._id;
    var order = StockOrders.findOne(id);
    if (order && order.deliveryStatus) {
      return order.deliveryStatus;
    }
  },

  isDeliveredCorreclty: function () {
    var id = this.item._id;
    var order = StockOrders.findOne(id);
    if (order && order.deliveryStatus) {
      if (order.deliveryStatus.length == 1 && order.deliveryStatus[0] == "Delivered Correctly") {
        return true;
      }
    }
  },

  isWrongQuantity: function() {
    var id = this.item._id;
    var order = StockOrders.findOne(id);
    if (order && order.deliveryStatus && order.deliveryStatus.length > 0) {
      if (order.deliveryStatus.indexOf("Wrong Quantity") >= 0) {
        return true;
      }
    }
  },

  isWrongPrice: function() {
    var id = this.item._id;
    var order = StockOrders.findOne(id);
    if (order && order.deliveryStatus && order.deliveryStatus.length > 0) {
      if (order.deliveryStatus.indexOf("Wrong Price") >= 0) {
        return true;
      }
    }
  },

  isEditable: function(id) {
    return Session.get("editable" + id);
  },

  isReceived: function() {
    var id = Session.get("thisReceipt");
    var data = OrderReceipts.findOne(id);
    if (data) {
      if (data.received) {
        return true;
      }
    }
  }
});

Template.orderReceiveItem.events({
  'click .deliveredCorrectly': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    var receiptId = Session.get("thisReceipt");
    var status = "Delivered Correctly";
    var info = {};
    receiveReceiptItems(id, receiptId, status, info);
  },

  'click .wrongPrice': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("thisOrder", id);
    $("#wrongPriceModal").modal();
  },

  'click .wrongQuantity': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("thisOrder", id);
    $("#wrongQuantityModal").modal();
  },

  'click .receiveOrderItem': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("editable" + id, false);
    var receiptId = Session.get("thisReceipt");
    Meteor.call("receiveOrderItems", id, receiptId, {"received": true}, HospoHero.handleMethodResult());
  },

  'click .editPermitted': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("editable" + id, true);
  }
});

function receiveReceiptItems(id, receiptId, status, info) {
  var order = StockOrders.findOne(id);
  if (order) {
    Meteor.call("updateOrderItems", id, receiptId, status, info, HospoHero.handleMethodResult());
  }
}