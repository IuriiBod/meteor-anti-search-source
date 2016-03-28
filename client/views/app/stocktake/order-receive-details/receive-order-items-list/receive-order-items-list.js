Template.receiveOrderItemsList.helpers({
  orderItems() {
    return OrderItems.find({orderId: this._id});
  },

  totalCost(orderItems) {
    let cost = 0;

    orderItems.forEach(function (order) {
      let count = order.receivedCount;
      if (!_.isFinite(count) || count < 0) {
        count = order.orderedCount;
      }
      cost += count * order.ingredient.cost;
    });

    return HospoHero.misc.rounding(cost);
  }
});
