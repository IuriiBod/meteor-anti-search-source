var component = FlowComponents.define("ordersList", function(props) {
});

component.state.list = function() {
  var data = StockOrders.find({
    "stocktakeDate": Session.get("thisDate"),
    "supplier": Session.get("activeSupplier")
  });
  return data;
}
