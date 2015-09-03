var component = FlowComponents.define('ingredientItemEdit', function(props) {
  this.id = props.ingredient._id;
  var item = getIngredientItem(this.id);
  if(item) {
    this.ingredient = item;
    this.quantity = props.ingredient.quantity;
  }
});

component.state.item = function() {
  return this.ingredient;
}

component.state.quantity = function() {
  if(this.quantity) {
    return this.quantity;
  } else {
    return 1;
  }
}