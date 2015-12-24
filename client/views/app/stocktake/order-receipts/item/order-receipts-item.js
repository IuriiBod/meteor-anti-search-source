Template.orderReceiptItem.helpers({
  isInvoiceUploaded: function() {
    return this.hasOwnProperty("invoiceImage");
  },

  orderedValue: function() {
    var cost = 0;
    var id = this._id;
    StockOrders.find({"orderReceipt": id}).forEach(function (order) {
      cost += parseFloat(order.countOrdered) * parseFloat(order.unitPrice);
    });
    return cost;
  },

  invoiceFaceValue: function() {
    var cost = 0;
    var id = this._id;
    var orders = StockOrders.find({"orderReceipt": id}).fetch();
    if (orders.length > 0) {
      orders.forEach(function (order) {
        if (order.received) {
          var quantity = order.countOrdered;
          if (order.countDelivered) {
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
    
    var id = this._id;
    if (id) {
      Router.go("orderReceive", {"_id": id});
    }
  }
});