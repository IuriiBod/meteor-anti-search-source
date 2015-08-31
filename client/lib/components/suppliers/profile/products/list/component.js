var component = FlowComponents.define("productsList", function(props) {});

component.state.products = function() {
  var stocks = Ingredients.find({"suppliers": Session.get("thisSupplier")});
  return stocks;
}