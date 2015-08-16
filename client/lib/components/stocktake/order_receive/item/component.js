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
  return this.item.unitPrice * this.item.countOrdered;
}

component.state.deliveryStatus = function() {
  var id = this.item._id;
  var order = StockOrders.findOne(id);
  if(order) {
    if(order.deliveryStatus == "wrongPrice") {
      return "Wrong Price";
    } else if(order.deliveryStatus == "wrongQuantity") {
      return "Wrong Quantity";
    } else if(order.deliveryStatus == "deliveredCorrectly") {
      return "Delivered Correctly";
    }
  }
}

component.state.isWrongQuantity = function() {
  var id = this.item._id;
  var order = StockOrders.findOne(id);
  if(order && order.hasOwnProperty("countDelivered")) {
    return true;
  }
}