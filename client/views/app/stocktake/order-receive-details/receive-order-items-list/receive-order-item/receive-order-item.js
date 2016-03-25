class OrderItemStatus {
  constructor(orderItem) {
    this._orderItem = orderItem;
  }

  isReceived() {
    return _.isFinite(this._orderItem.receivedCount);
  }

  isWrongCount() {
    if (this.isReceived()) {
      let receivedCount = this._orderItem.receivedCount;
      return _.isFinite(receivedCount) && receivedCount !== this._orderItem.orderedCount;
    } else {
      return true; // until items isn't received it has wrong price
    }
  }

  isWrongPrice() {
    if (this.isReceived()) {
      let originalCost = this._orderItem.ingredient.originalCost;
      return _.isFinite(originalCost) && this._orderItem.ingredient.cost !== originalCost;
    } else {
      return true; // until items isn't received it has wrong count
    }
  }

  isDeliveredCorrectly() {
    return !this.isWrongCount() && !this.isWrongPrice();
  }
}

Template.receiveOrderItem.helpers({
  //helper is called ingredientItem in order to avoid name conflict with order item's ingredient property.
  ingredientItem: function () {
    return Ingredients.findOne({_id: this.ingredient.id});
  },

  unitTotalPrice: function (orderItemCount) {
    return HospoHero.misc.rounding(this.ingredient.cost * orderItemCount);
  },

  orderItemCount: function () {
    return _.isFinite(this.receivedCount) ? this.receivedCount : this.orderedCount;
  },

  orderItemStatus: function () {
    return new OrderItemStatus(this);
  },

  isDelivered: function () {
    let order = Orders.findOne({_id: this.orderId});
    return !!order.receivedBy;
  }
});

Template.receiveOrderItem.events({
  'click .wrong-price-button': function (event, tmpl) {
    event.preventDefault();
    ModalManager.open('wrongPriceModal', tmpl.data);
  },

  'click .wrong-quantity-button': function (event, tmpl) {
    event.preventDefault();
    ModalManager.open('wrongQuantityModal', tmpl.data);
  },

  'click .receive-order-item-button': function (event, tmpl) {
    event.preventDefault();
    let orderItem = tmpl.data;
    orderItem.receivedCount = orderItem.orderedCount;
    Meteor.call('updateOrderItem', orderItem, HospoHero.handleMethodResult());
  }
});