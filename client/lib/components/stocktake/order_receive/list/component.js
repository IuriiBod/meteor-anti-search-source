var component = FlowComponents.define("orderReceive", function(props) {});

component.state.list = function() {
  var data = StockOrders.find({"orderReceipt": Session.get("stockReceipt")});
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