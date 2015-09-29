var component = FlowComponents.define("orderReceiveItem", function(props) {
  this.item = props.item;
});

component.state.stock = function() {
  var ingredient = Ingredients.findOne(this.item.stockId);
  if(ingredient) {
    this.item['description'] = ingredient.description;
  }
  return this.item;
};

component.state.total = function() {
  var quantity = this.item.countOrdered;
  if(this.item.hasOwnProperty("countDelivered")) {
    quantity = this.item.countDelivered;
  }
  return this.item.unitPrice * quantity;
};

component.state.deliveryStatus = function() {
  var order = StockOrders.findOne(this.item._id);
  if(order && order.deliveryStatus) {
    return order.deliveryStatus; 
  }
};

component.state.isDeliveredCorreclty = function() {
  var order = StockOrders.findOne(this.item._id);
  if(order && order.deliveryStatus) {
    return order.deliveryStatus.length == 1 && order.deliveryStatus[0] == "Delivered Correctly";
  }
};

component.state.isWrongQuantity = function() {
  var id = this.item._id;
  var order = StockOrders.findOne(id);
  return order &&
    order.deliveryStatus &&
    order.deliveryStatus.length > 0 &&
    order.deliveryStatus.indexOf("Wrong Quantity") >= 0;
};

component.state.isWrongPrice = function() {
  var order = StockOrders.findOne(this.item._id);
  return order &&
    order.deliveryStatus &&
    order.deliveryStatus.length > 0 &&
    order.deliveryStatus.indexOf("Wrong Price") >= 0;
};

component.state.isEditable = function(id) {
  return Session.get("editable" + id);
};

component.state.isReceived = function() {
  var id = Session.get("thisReceipt");
  var data = OrderReceipts.findOne(id);
  return data && data.received;
};