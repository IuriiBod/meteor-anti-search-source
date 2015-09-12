var component = FlowComponents.define("listOfIngredients", function(props) {
});

component.state.ingredientsList = function() {
  var localId = Session.get("localId");
  if(localId) {
    var localJobItem = LocalJobItem.findOne(localId);
    if(localJobItem && localJobItem.ings.length > 0) {
      return localJobItem.ings;
    }
  }
};