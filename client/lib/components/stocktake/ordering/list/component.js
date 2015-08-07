var component = FlowComponents.define("ordersList", function(props) {
});

component.state.list = function() {
  var data = StockOrders.find({
    "stocktakeDate": Session.get("thisDate"),
    "supplier": Session.get("activeSupplier")
  });
  var dataFetched = data.fetch();
  var ings = [];
  if(dataFetched.length > 0) {
    dataFetched.forEach(function(doc) {
      if(ings.indexOf(doc.stockId) < 0) {
        ings.push(doc.stockId);
      }
    });
    if(ings.length > 0) {
      subs.subscribe("ingredients", ings);
    }
  }
  return data;
}
