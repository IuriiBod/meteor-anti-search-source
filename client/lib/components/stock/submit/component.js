var component = FlowComponents.define('submitIngredient', function(props) {
});

component.action.submit = function(event, info) {
  Meteor.call("createIngredients", info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      IngredientsListSearch.cleanHistory(); 
      IngredientsListSearch.search("", {"limit": 10});
    }
    $(event.target).find("[type=text]").val("");
    $("#addIngredientModal").modal("hide");
  });
};

component.state.suppliers = function() {
  return Suppliers.find({}, {sort: {"name": 1}});
}

component.state.unitsOrdered = function() {
  return OrderingUnits.find();
}

component.state.unitsUsed = function() {
  return UsingUnits.find();
}