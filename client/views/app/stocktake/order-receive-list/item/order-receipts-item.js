Template.orderReceiptItem.helpers({
  isInvoiceUploaded() {
    return this.hasOwnProperty("invoiceImage");
  },

  orderedValue() {
    let cost = 0;
    OrderItems.find({orderReceipt: this._id}).forEach(function (order) {
      let countOrdered = order.countOrdered || 0;
      cost += parseFloat(countOrdered) * parseFloat(order.unitPrice);
    });
    return cost;
  },

  receivedAmount() {
    let cost = 0;
    OrderItems.find({orderReceipt: this._id}).forEach((order) => {
      if (order.received) {
        var quantity = order.countOrdered;
        if (_.isFinite(order.countDelivered) && order.countDelivered >= 0) {
          quantity = order.countDelivered;
        }
        cost += parseFloat(quantity) * parseFloat(order.unitPrice);
      }
    });
    return cost;
  }
});

Template.orderReceiptItem.events({
  'click .receive-delivery': function (event) {
    event.preventDefault();

    if (this._id) {
      Router.go("orderReceive", {_id: this._id});
    }
  }
});