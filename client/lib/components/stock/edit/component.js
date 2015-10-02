var subs = new SubsManager();

var component = FlowComponents.define('editIngredientItem', function(props) {});

component.state.id = function() {
  subs.clear();
  var id = Session.get("thisIngredientId");
  subs.subscribe("ingredients", [id]);
  //var ing = Ingredients.findOne(id);
  return id;
};

component.state.relatedJobs = function() {
  var id = Session.get("thisIngredientId");
  subs.reset();
  subs.subscribe("ingredientsRelatedJobs", id);
  return JobItems.find().fetch();
};

component.state.convertTime = function(time) {
  return time / 60;
};

component.action.submit = function(id, info) {
   Meteor.call("editIngredient", id, info, function(err) {
    if(err) {
      HospoHero.alert(err);
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
};

component.state.isArchive = function() {
  var id = Session.get("thisIngredientId");
  if(id != undefined) {
    return !!Ingredients.findOne({_id: id, status: 'archived'});
  }
};