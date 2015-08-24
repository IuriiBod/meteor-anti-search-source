var subs = new SubsManager();

var component = FlowComponents.define('editIngredientItem', function(props) {
});

component.state.id = function() {
  subs.clear();
  var id = Session.get("thisIngredientId");
  subs.subscribe("ingredients", [id]);
  var ing = Ingredients.findOne(id);
  return id;
}

component.state.relatedJobs = function() {
  var id = Session.get("thisIngredientId");
  subs.subscribe("ingredientsRelatedJobs", id);
  var relatedJobs = [];
  relatedJobs = JobItems.find().fetch();
  return relatedJobs;
}

component.state.convertTime = function(time) {
  return time/60;
}

component.action.submit = function(id, info, event) {
   Meteor.call("editIngredient", id, info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      IngredientsListSearch.cleanHistory();
      IngredientsListSearch.search("", {"limit": 10});
    }
    $("#editIngredientModal").modal("hide");
  });
};

component.state.suppliers = function() {
  var id = Session.get("thisIngredientId");
  var ing = Ingredients.findOne(id);
  if(ing) {
    return Suppliers.find({"_id": {$nin: [ing.suppliers]}}, {sort: {"name": 1}});
  }
}

component.state.isManagerOrAdmin = function() {
  var userId = Meteor.userId();
  return isManagerOrAdmin(userId);
}

component.state.isDisabled = function() {
  if(isManagerOrAdmin(Meteor.userId())) {
    return false;
  } else {
    return true;
  }
}
