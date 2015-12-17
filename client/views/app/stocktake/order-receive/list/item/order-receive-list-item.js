Template.orderReceiveItem.onCreated(function() {
  this.editable = new ReactiveVar();
});

Template.orderReceiveItem.helpers({
  stock: function () {
    var ingredient = Ingredients.findOne({_id: this.item.stockId});
    if (ingredient) {
      this.item['description'] = ingredient.description;
    }
    return this.item;
  },

  total: function () {
    var quantity = this.item.hasOwnProperty("countDelivered") ? this.item.countDelivered : this.item.countOrdered;
    return this.item.unitPrice * quantity;
  },

  deliveryStatus: function() {
    var order = StockOrders.findOne({_id: this.item._id});
    if (order && order.deliveryStatus) {
      return order.deliveryStatus;
    }
  },

  isDeliveredCorrectly: function () {
    var order = StockOrders.findOne({_id: this.item._id});
    if (order && order.deliveryStatus) {
      if (order.deliveryStatus.length == 1 && order.deliveryStatus[0] == "Delivered Correctly") {
        return true;
      }
    }
  },

  isWrongQuantity: function() {
    var order = StockOrders.findOne({_id: this.item._id});
    if (order && order.deliveryStatus && order.deliveryStatus.length > 0) {
      if (order.deliveryStatus.indexOf("Wrong Quantity") >= 0) {
        return true;
      }
    }
  },

  isWrongPrice: function() {
    var order = StockOrders.findOne({_id: this.item._id});
    if (order && order.deliveryStatus && order.deliveryStatus.length > 0) {
      if (order.deliveryStatus.indexOf("Wrong Price") >= 0) {
        return true;
      }
    }
  },

  isReceived: function() {
    var data = OrderReceipts.findOne({_id: this.item.orderReceipt});
    if (data && data.received) {
        return true;
    }
  },

  isEditable: function() {
    return Template.instance().editable.get();
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
    tmpl.editable.set(false);
    var receiptId = tmpl.data.item.orderReceipt;
    Meteor.call("receiveOrderItems", id, receiptId, {"received": true}, HospoHero.handleMethodResult());
  },

  'click .editPermitted': function (event, tmpl) {
    event.preventDefault();
    tmpl.editable.set(true);
  }
});

function receiveReceiptItems(id, receiptId, status, info) {
  var order = StockOrders.findOne({_id: id});
  if (order) {
    Meteor.call("updateOrderItems", id, receiptId, status, info, HospoHero.handleMethodResult());
  }
}