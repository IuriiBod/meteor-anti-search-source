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
  Meteor.call("editIngredient", this.get('id'), info, HospoHero.handleMethodResult(function () {
    IngredientsListSearch.cleanHistory();
    $("#editIngredientModal").modal("hide");
  }));
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

// TODO: Check this method
component.action.archiveIng = function (id, state) {
  Meteor.call("archiveIngredient", id, state, HospoHero.handleMethodResult(function () {
    $("#editIngredientModal").modal("hide");

    var text = "Stock item";
    if (state == "restore") {
      text += " restored";
    } else if (state == "archive") {
      text += " archived";
    } else {
      text += " removed";
    }
    HospoHero.info(text);

    IngredientsListSearch.cleanHistory();
    var selector = {
      limit: 30
    };
    if (Router.current().params.type == "archive") {
      selector.status = "archived";
    } else {
      selector.status = {$ne: "archived"};
    }
    IngredientsListSearch.search("", selector);
  }));
};