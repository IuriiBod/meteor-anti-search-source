var component = FlowComponents.define('editIngredientItem', function(props) {});

component.state.id = function() {
  var id = Session.get("thisIngredientId");
  var ing = Ingredients.findOne(id);
  if(ing) {
    this.set("description", ing.description)
  }
  return id;
};

component.state.relatedJobs = function() {
  var id = Session.get("thisIngredientId");
  subs.reset();
  subs.subscribe("ingredientsRelatedJobs", id);
  return JobItems.find({ "ingredients._id": id }).fetch();
};

component.state.convertTime = function(time) {
  return time / 60;
};

component.action.submit = function(id, info) {
   Meteor.call("editIngredient", id, info, function(err) {
    if(err) {
      HospoHero.error(err);
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

component.state.unitsOrdered = function() {
  var id = Session.get("thisIngredientId");
  var ing = Ingredients.findOne(id);
  var thisIngId = null;
  if(ing) {
    thisIngId = ing.portionOrdered;
  }
  return OrderingUnits.find({"unit": {$nin: [thisIngId]}});
};

component.state.unitsUsed = function() {
  var id = Session.get("thisIngredientId");
  var ing = Ingredients.findOne(id);
  var thisIngId = null;
  if(ing) {
    thisIngId = ing.portionUsed;
  }
  return UsingUnits.find({"unit": {$nin: [thisIngId]}});
};

component.action.archiveIng = function(id, state) {
  subs.subscribe("ingredients", [id]);
  var self = this;
  Meteor.call("archiveIngredient", id, state, function(err) {
    if(err) {
      HospoHero.error(err);
    } else {
      $("#editIngredientModal").modal("hide");
      
      var stock = Ingredients.findOne(id);
      if(stock) {
        var text = "Stock item " + stock.description;
        if(stock.status == "active") {
          text += " restored";
        } else if(stock.status == "archived") {
          text += " archived";
        }
        HospoHero.info(text);
      } else {
        HospoHero.info("Stock item " + self.get("description") + " removed");
      }
      
      IngredientsListSearch.cleanHistory();
      var selector = {
        limit: 30
      };
      if(Router.current().params.type == "archive") {
        selector.status = "archived";
      } else {
        selector.status = {$ne: "archived"};
      }
      IngredientsListSearch.search("", selector);
    }
  });
};