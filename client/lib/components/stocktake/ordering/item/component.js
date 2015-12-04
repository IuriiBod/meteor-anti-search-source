var component = FlowComponents.define("ordersListItem", function(props) {
  this.orderId = props.itemId;
});

component.state.order = function() {
  var order = StockOrders.findOne({ _id: this.orderId });
  if(order) {
    var stock = Ingredients.findOne({_id: order.stockId});
    if(stock) {
      order.stockName = stock.description;
    }
    return order;
  }
};

component.state.editable = function() {
  var order = StockOrders.findOne({ _id: this.orderId });
  if(order) {
    return !order.orderReceipt;
  }
};