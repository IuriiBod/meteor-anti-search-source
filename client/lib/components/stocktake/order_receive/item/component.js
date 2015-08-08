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