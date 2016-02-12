Template.orderReceiptItem.helpers({
  isInvoiceUploaded: function() {
    return this.hasOwnProperty("invoiceImage");
  },

  orderedValue: function() {
    var cost = 0;
    StockOrders.find({"orderReceipt": this._id}).forEach(function (order) {
      let countOrdered = order.countOrdered || 0;
      cost += parseFloat(countOrdered) * parseFloat(order.unitPrice);
    });
    return cost;
  },

  invoiceFaceValue: function() {
    let cost = 0;
    StockOrders.find({"orderReceipt": this._id}).forEach((order) => {
      if (order.received) {
        var quantity = order.countOrdered;
        if (order.countDelivered) {
          quantity = order.countDelivered;
        }
        cost += parseFloat(quantity) * parseFloat(order.unitPrice)
      }
    });
    return cost;
  }
});

Template.orderReceiptItem.events({
  'click .receive-delivery': function (event) {
    event.preventDefault();

    if (this._id) {
      Router.go("orderReceive", {"_id": this._id});
    }
  }
});