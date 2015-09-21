var component = FlowComponents.define("listOfIngredients", function(props) {
  this.name = props.name;
  subs.subscribe("allSuppliers");
  this.id = props.id;
});

component.state.ingredientsList = function() {
  var localId = Session.get("localId");
  var ids = [];
  if(localId) {
    if(this.id == "menuSubmit") {
      var localMenuItem = LocalMenuItem.findOne(localId);
      if(localMenuItem && localMenuItem.ings.length > 0) {
        ids = localMenuItem.ings;
      }
    } else {
      var localJobItem = LocalJobItem.findOne(localId);
      if(localJobItem && localJobItem.ings.length > 0) {
        ids = localJobItem.ings;
      }
    }
  }
  Meteor.subscribe("ingredients", ids);
  return ids;
}

component.state.isMenu = function() {
  if(this.id == "menuSubmit") {
    return true;
  } else {
    return false;
  }
}

component.state.name = function() {
  return this.name;
}

component.state.id = function() {
  return Session.get("thisJobItem");
}