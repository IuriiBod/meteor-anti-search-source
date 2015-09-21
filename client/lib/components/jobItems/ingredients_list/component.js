var component = FlowComponents.define("listOfIngredients", function(props) {
  this.name = props.name;
  subs.subscribe("allSuppliers");
  this.id = props.id;
});

component.state.ingredientsList = function() {
  var localId = Session.get("localId");
  if(localId) {
    if(this.id == "menuSubmit") {
      var localMenuItem = LocalMenuItem.findOne(localId);
      if(localMenuItem && localMenuItem.ings.length > 0) {
        return localMenuItem.ings;
      }
    } else {
      var localJobItem = LocalJobItem.findOne(localId);
      if(localJobItem && localJobItem.ings.length > 0) {
        return localJobItem.ings;
      }
    }
  }
};

component.state.isMenu = function() {
  return this.id == "menuSubmit";
};

component.state.name = function() {
  return this.name;
};

component.state.id = function() {
  return Session.get("thisJobItem");
};