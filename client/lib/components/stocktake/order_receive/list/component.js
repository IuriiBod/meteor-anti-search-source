var component = FlowComponents.define("orderReceive", function(props) {});

component.state.list = function() {
  var data = StockOrders.find({"orderReceipt": Session.get("thisReceipt")});
  var stockIds = [];
  if(data) {
    data.forEach(function(doc) {
      if(stockIds.indexOf(doc.stockId) < 0) {
        stockIds.push(doc.stockId);
      }
    });
    if(stockIds.length > 0) {
      subs.subscribe("ingredients", stockIds);
    }
    return data;
  }
}

component.state.total = function() {
  var orders = StockOrders.find({"orderReceipt": Session.get("thisReceipt")}).fetch();
  var cost = 0;
  if(orders.length > 0) {
    orders.forEach(function(order) {
      cost += parseFloat(order.countOrdered) * parseFloat(order.unitPrice)
    });
  }
  return cost;
}

component.state.receipt = function() {
  var id = Session.get("thisReceipt")
  var data = OrderReceipts.findOne(id);
  if(data) {
    return data;
  }
}

component.state.isReceived = function() {
  var id = Session.get("thisReceipt")
  var data = OrderReceipts.findOne(id);
  if(data) {
    if(data.received) {
      return true;
    } 
  }
}

component.state.receivedNote = function() {
  var receipt = OrderReceipts.findOne(Session.get("thisReceipt"));
  if(receipt) {
    return receipt.receiveNote;
  }
}