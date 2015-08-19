var component = FlowComponents.define("orderReceiveItem", function(props) {
  this.item = props.item;
});

component.state.stock = function() {
  var ingredient = Ingredients.findOne(this.item.stockId);
  if(ingredient) {
    this.item['description'] = ingredient.description;
  }
  return this.item;
}

component.state.total = function() {
  var total = 0;
  var quantity = this.item.countOrdered;
  if(this.item.hasOwnProperty("countDelivered")) {
    quantity = this.item.countDelivered;
  }
  total = this.item.unitPrice * quantity;
  return total;

}

component.state.deliveryStatus = function() {
  var id = this.item._id;
  var order = StockOrders.findOne(id);
  if(order && order.deliveryStatus) {
    return order.deliveryStatus; 
  }
}

component.state.isDeliveredCorreclty = function() {
  var id = this.item._id;
  var order = StockOrders.findOne(id);
  if(order && order.deliveryStatus) {
    if(order.deliveryStatus.length == 1 && order.deliveryStatus[0] == "Delivered Correctly") {
      return true;
    }
  }
}

component.state.isWrongQuantity = function() {
  var id = this.item._id;
  var order = StockOrders.findOne(id);
  if(order && order.deliveryStatus && order.deliveryStatus.length > 0) {
    if(order.deliveryStatus.indexOf("Wrong Quantity") >= 0) {
      return true;
    }
  }
}

component.state.isWrongPrice = function() {
  var id = this.item._id;
  var order = StockOrders.findOne(id);
  if(order && order.deliveryStatus && order.deliveryStatus.length > 0) {
    if(order.deliveryStatus.indexOf("Wrong Price") >= 0) {
      return true;
    }
  }
}