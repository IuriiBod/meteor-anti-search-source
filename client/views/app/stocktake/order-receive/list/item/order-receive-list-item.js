Template.orderReceiveItem.onCreated(function() {
  this.isEditable = new ReactiveVar(false);
});

Template.orderReceiveItem.helpers({
  stock: function () {
    debugger;
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
    var order = this.item;
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
    return data && data.received;
  },

  isEditable: function () {
    return Template.instance().isEditable.get();
  }
});

Template.orderReceiveItem.events({

  'click .wrong-price-button': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.item._id;
    tmpl.data.currentOrderCallback(id);
    $("#wrongPriceModal").modal();
  },

  'click .wrong-quantity-button': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.item._id;
    tmpl.data.currentOrderCallback(id);
    $("#wrongQuantityModal").modal();
  },

  'click .receive-order-item-button': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.isEditable.set(false);
    var receiptId = tmpl.data.item.orderReceipt;
    Meteor.call("receiveOrderItems", id, receiptId, {"received": true}, HospoHero.handleMethodResult());
  },

  'click .edit-permitted-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.isEditable.set(true);
  }
});