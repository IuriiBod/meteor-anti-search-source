Template.editIngredientItem.helpers({
  item: function () {
    var id = Session.get("thisIngredientId");
    if (id) {
      return Ingredients.findOne(id);
    }
  }
});

Template.editIngredientItem.events({
});

var component = FlowComponents.define('editIngredientItem', function (props) {
});

component.state.id = function () {
  var id = Session.get("thisIngredientId");
  var ing = Ingredients.findOne(id);
  if (ing) {
    this.set("description", ing.description)
  }
  return id;
};

component.state.relatedJobs = function () {
  var id = Session.get("thisIngredientId");
  return JobItems.find({"ingredients._id": id}).fetch();
};

component.state.convertTime = function (time) {
  return time / 60;
};

component.action.submit = function (info) {

};

component.state.suppliers = function () {
  var id = Session.get("thisIngredientId");
  var ing = Ingredients.findOne(id);
  if (ing) {
    return Suppliers.find({"_id": {$nin: [ing.suppliers]}}, {sort: {"name": 1}});
  }
};

component.state.isArchive = function () {
  var id = Session.get("thisIngredientId");
  if (id != undefined) {
    return !!Ingredients.findOne({_id: id, status: 'archived'});
  }
};

component.action.archiveIng = function (id, state) {

};