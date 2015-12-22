Template.orderReceiveItem.onCreated(function() {
  this.set('isEditable', false);
});

Template.orderReceiveItem.helpers({
  stock: function () {
    var ingredient = Ingredients.findOne({_id: this.item.stockId});
    if (ingredient) {
      this.item['description'] = ingredient.description;
    }
    return this.item;
  },

  unitTotalPrice: function () {
    var quantity = this.item.countDelivered || this.item.countOrdered;
    return this.item.unitPrice * quantity;
  },

  delivery: function() {
    var order = StockOrders.findOne({_id: this.item._id});
    var deliveredCorrectly, wrongQuantity, wrongPrice, status;
    if(order && order.deliveryStatus) {
      deliveredCorrectly = order.deliveryStatus.indexOf('Delivered Correctly') >= 0;
      wrongQuantity = order.deliveryStatus.indexOf('Wrong Quantity') >= 0;
      wrongPrice = order.deliveryStatus.indexOf('Wrong Price') >= 0;
      status = order.deliveryStatus;
    }
    return {
      status: status,
      deliveredCorrectly: deliveredCorrectly,
      wrongQuantity: wrongQuantity,
      wrongPrice: wrongPrice
    };
  },

  isReceived: function() {
    var data = OrderReceipts.findOne({_id: this.item.orderReceipt});
    if (data && data.received) {
        return true;
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
    tmpl.set('isEditable', false);
    var receiptId = tmpl.data.item.orderReceipt;
    Meteor.call("receiveOrderItems", id, receiptId, {"received": true}, HospoHero.handleMethodResult());
  },

  'click .editPermitted': function (event, tmpl) {
    event.preventDefault();
    tmpl.set('isEditable', true);
  }
});

function receiveReceiptItems(id, receiptId, status, info) {
  var order = StockOrders.findOne({_id: id});
  if (order) {
    Meteor.call("updateOrderItems", id, receiptId, status, info, HospoHero.handleMethodResult());
  }
}