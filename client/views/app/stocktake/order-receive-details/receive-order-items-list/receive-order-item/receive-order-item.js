Template.receiveOrderItem.onCreated(function () {
  this.isEditable = new ReactiveVar(false);
});

Template.receiveOrderItem.helpers({
  stock: function () {
    var ingredient = Ingredients.findOne({_id: this.item.stockId});
    if (ingredient) {
      this.item.description = ingredient.description;
    }
    return this.item;
  },

  unitTotalPrice: function () {
    var quantity = this.item.countDelivered;
    if (!_.isFinite(quantity) || quantity < 0) {
      quantity = this.item.countOrdered;
    }
    return this.item.unitPrice * quantity;
  },

  delivery: function () {
    var delivery = {};
    var order = this.item;
    if (order && order.deliveryStatus) {
      delivery.deliveredCorrectly = order.deliveryStatus.indexOf('Delivered Correctly') >= 0;
      delivery.wrongQuantity = order.deliveryStatus.indexOf('Wrong Quantity') >= 0;
      delivery.wrongPrice = order.deliveryStatus.indexOf('Wrong Price') >= 0;
      delivery.status = order.deliveryStatus;
    }
    return delivery;
  },

  isReceived: function () {
    var data = Orders.findOne({_id: this.item.orderReceipt});
    return data && data.received;
  },

  isEditable: function () {
    return Template.instance().isEditable.get();
  }
});

Template.receiveOrderItem.events({

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