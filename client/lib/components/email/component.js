var component = FlowComponents.define("composeMail", function(props) {
  console.log("...", props);
});

component.state.initialHTML = function() {
  var data = StockOrders.find({
    "version": Session.get("thisVersion"),
    "supplier": Session.get("activeSupplier")
  }).fetch();
  var table = "<table class='table table-condensed table-hover table-striped'><thead><tr><th>Stock Item</th><th>Amount</th></tr></thead><tbody></tbody></table>"
  if(data && data.length > 0) {
    // $(table).append($(header));
    data.forEach(function(item) {
      var tr = '<tr><td>' + item.stockId + '</td><td>' + item.countOrdered + '</td></tr>'
      $(table).append($(tr));
    });
    return table;
  }
  console.log(data, table);
}
