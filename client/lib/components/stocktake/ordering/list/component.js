var component = FlowComponents.define("ordersList", function(props) {
});

component.state.list = function() {
  return StockOrders.find({
    "stocktakeDate": Session.get("thisDate"),
    "supplier": Session.get("activeSupplier")
  });
}
