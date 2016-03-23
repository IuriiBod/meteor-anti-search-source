Template.receiveOrderItemsList.helpers({
  orderItems() {
    return OrderItems.find({orderId: this._id});
  },

  total() {
    let cost = 0;
    OrderItems.find({orderId: this._id}).forEach(function (order) {
      let count = order.receivedCount;
      if (!_.isFinite(count) || count < 0) {
        count = order.orderedCount;
      }
      cost += count * order.ingredient.cost;
    });
    return cost;
  }
});
