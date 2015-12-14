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
    var order = StockOrders.findOne({_id: id});
    if (order && order.deliveryStatus) {
      return order.deliveryStatus;
    }
  },

  isDeliveredCorreclty: function () {
    var id = this.item._id;
    var order = StockOrders.findOne({_id: id});
    if (order && order.deliveryStatus) {
      if (order.deliveryStatus.length == 1 && order.deliveryStatus[0] == "Delivered Correctly") {
        return true;
      }
    }
  },

  isWrongQuantity: function() {
    var id = this.item._id;
    var order = StockOrders.findOne({_id: id});
    if (order && order.deliveryStatus && order.deliveryStatus.length > 0) {
      if (order.deliveryStatus.indexOf("Wrong Quantity") >= 0) {
        return true;
      }
    }
  },

  isWrongPrice: function() {
    var id = this.item._id;
    var order = StockOrders.findOne({_id: id});
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
    var id = this.item.orderReceipt;
    var data = OrderReceipts.findOne({_id: id});
    if (data) {
      if (data.received) {
        return true;
      }
    }
  }
});

Template.orderReceiveItem.events({
  'click .deliveredCorrectly': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.item._id;
    var receiptId = tmpl.data.item.orderReceipt;
    var status = "Delivered Correctly";
    var info = {};
    receiveReceiptItems(id, receiptId, status, info);
  },

  'click .wrongPrice': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.item._id;
    tmpl.data.currentOrderCallback(id);
    $("#wrongPriceModal").modal();
  },

  'click .wrongQuantity': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.item._id;
    tmpl.data.currentOrderCallback(id);
    $("#wrongQuantityModal").modal();
  },

  'click .receiveOrderItem': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    Session.set("editable" + id, false);
    var receiptId = tmpl.data.item.orderReceipt;
    Meteor.call("receiveOrderItems", id, receiptId, {"received": true}, HospoHero.handleMethodResult());
  },

  'click .editPermitted': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.item._id;
    Session.set("editable" + id, true);
  }
});

function receiveReceiptItems(id, receiptId, status, info) {
  var order = StockOrders.findOne({_id: id});
  if (order) {
    Meteor.call("updateOrderItems", id, receiptId, status, info, HospoHero.handleMethodResult());
  }
}