var component = FlowComponents.define('ingredientItemEdit', function(props) {
  this.id = props.id;
  this.quantity = 1;
});

component.state.item = function() {
  var item = Ingredients.findOne(this.id);
  if(item) {
    return item;
  }
};

component.state.unitPrice = function() {
  var item = getIngredientItem(this.id);
  if(item) {
    return item.costPerPortionUsed;
  }
};

component.state.quantity = function() {
  if(this.quantity) {
    return this.quantity;
  } else {
    return 1;
  }
};