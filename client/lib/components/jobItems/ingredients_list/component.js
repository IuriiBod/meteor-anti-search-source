var component = FlowComponents.define("listOfIngredients", function(props) {
  this.name = props.name;
  subs.subscribe("allSuppliers");
});

component.state.ingredientsList = function() {
  var localId = Session.get("localId");
  if(localId) {
    var localJobItem = LocalJobItem.findOne(localId);
    if(localJobItem && localJobItem.ings.length > 0) {
      return localJobItem.ings;
    }
  }
}

component.state.name = function() {
  return this.name;
}

component.state.id = function() {
  return Session.get("thisJobItem");
}