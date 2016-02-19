Template.orderReceiptItem.helpers({
  isInvoiceUploaded: function() {
    return this.hasOwnProperty("invoiceImage");
  },

  orderedValue: function() {
    var cost = 0;
    StockOrders.find({"orderReceipt": this._id}).forEach(function (order) {
      cost += parseFloat(order.countOrdered) * parseFloat(order.unitPrice);
    });
    return cost;
  },

  invoiceFaceValue: function() {
    var cost = 0;
    var orders = StockOrders.find({"orderReceipt": this._id}).fetch();
    if (orders.length > 0) {
      orders.forEach(function (order) {
        if (order.received) {
          var quantity = order.countOrdered;
          if (_.isFinite(order.countDelivered) && order.countDelivered >= 0) {
            quantity = order.countDelivered;
          }
          cost += parseFloat(quantity) * parseFloat(order.unitPrice)
        }
      });
    }
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