var component = FlowComponents.define("orderReceiptItem", function(props) {
  this.item = props.item;
  subs.subscribe("receiptOrders", this.item._id);
});

component.state.receipt = function() {
  return this.item;
};

component.state.isInvoiceUploaded = function() {
  return this.item.hasOwnProperty("invoiceImage");
};

component.state.orderedValue = function() {
  var cost = 0;
  var id = this.item._id;
  var orders = StockOrders.find({"orderReceipt": id}).fetch();
  if(orders.length > 0) {
    orders.forEach(function(order) {
      cost += parseFloat(order.countOrdered) * parseFloat(order.unitPrice)
    });
  }
  return cost;
};

component.state.invoiceFaceValue = function() {
  var cost = 0;
  var id = this.item._id;
  var orders = StockOrders.find({
    "orderReceipt": id,
    "relations.areaId": HospoHero.getDefaultArea()
  }).fetch();

  if(orders.length > 0) {
    orders.forEach(function(order) {
      if(order.received) {
        var quantity = order.countOrdered;
        if(order.hasOwnProperty("countDelivered")) {
          quantity = order.countDelivered;
        }
        cost += parseFloat(quantity) * parseFloat(order.unitPrice)
      }
    });
  }
  return cost;
};