var component = FlowComponents.define("ordersListItem", function(props) {
  this.orderId = props.itemId;
  this.onRendered(this.onItemRendered);
});

component.state.order = function() {
  var order = StockOrders.findOne(this.orderId);
  if(order) {
    var stock = Ingredients.findOne({"_id": order.stockId});
    if(stock) {
      order.stockName = stock.description;
    }
    return order;
  }
}

component.state.editable = function() {
  var order = StockOrders.findOne(this.orderId);
  if(order) {
    if(order.orderReceipt) {
      return false;
    } else {
      return true;
    }
  }
}

component.state.supplier = function() {
  return Session.get("activeSupplier");
}

component.prototype.onItemRendered = function() {
}