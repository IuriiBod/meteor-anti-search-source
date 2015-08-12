var component = FlowComponents.define("ordersList", function(props) {
});

component.state.list = function() {
  var data = StockOrders.find({
    "version": Session.get("thisVersion"),
    "supplier": Session.get("activeSupplier")
  });
  var dataFetched = data.fetch();
  var ings = [];
  var orderIds = [];
  if(dataFetched.length > 0) {
    dataFetched.forEach(function(doc) {
      if(ings.indexOf(doc.stockId) < 0) {
        ings.push(doc.stockId);
      }
      if(orderIds.indexOf(doc._id) < 0) {
        orderIds.push(doc._id);
      }
    });
    if(ings.length > 0) {
      subs.subscribe("ingredients", ings);
    }
  }
  return orderIds;
}

component.state.version = function() {
  return Session.get("thisVersion");
}

component.state.supplier = function() {
  return Session.get("activeSupplier");
}
