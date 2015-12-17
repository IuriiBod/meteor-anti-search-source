//context: item (Ingredient/JobItem), type ("ing"/"prep")
Template.menuItemIngredientRow.events({
  'click .remove-ings': function (event) {
    event.preventDefault();
    var menu = Session.get("thisMenuItem");
    var id = $(event.target).attr("data-id");
    var confirmRemove = confirm("Are you sure you want to remove this item?");
    if (confirmRemove) {
      Meteor.call("removeItemFromMenu", menu, {ingredients: {_id: id}}, HospoHero.handleMethodResult(function () {
        $(event.target).closest("tr").remove()
      }));
    }
  },

  'click .remove-prep': function (event) {
    event.preventDefault();
    var menu = Session.get("thisMenuItem");
    var id = $(event.target).attr("data-id");
    var confirmRemove = confirm("Are you sure you want to remove this item ?");
    if (confirmRemove) {
      Meteor.call("removeItemFromMenu", menu, {jobItems: {_id: id}}, HospoHero.handleMethodResult(function () {
        $(event.target).closest("tr").remove()
      }));
    }
  },

  'click .view-prep': function (event) {
    event.preventDefault();
    var id = event.target.dataset.id;
    Session.set("goBackMenu", id);
    Router.go('jobItemEdit', {_id: id});
  },

  'click .view-ings': function (event) {
    event.preventDefault();
    var id = event.target.dataset.id;
    //todo: use new ingredientEditor API here
    //see: https://trello.com/c/OKnGRuGb/431-editingredientitem-submitingredientbody-submitingredient-will-be-replaced-with-ingredientitemeditor
    Session.set("thisIngredientId", id);
    $("#editIngredientModal").modal("show");
  }
});

var component = FlowComponents.define("ingsAndPreps", function (props) {
  this.type = props.type;
  this.id = props.item._id;
  this.quantity = props.item.quantity;
});

component.state.item = function () {
  if (this.type == "prep") {
    this.item = JobItems.findOne(this.id);
  } else if (this.type == "ings") {
    this.item = Ingredients.findOne(this.id);
  }
  if (this.item) {
    return this.item;
  }
};

component.state.name = function () {
  if (this.item) {
    if (this.type == "prep") {
      return this.item.name;
    } else if (this.type == "ings") {
      return this.item.description;
    }
  }
};

component.state.quantity = function () {
  if (this.item) {
    return this.quantity;
  }
};

component.state.type = function () {
  return this.type;
};

component.state.measure = function () {
  if (this.item) {
    if (this.type == "prep") {
      return this.item.measure;
    } else if (this.type == "ings") {
      return this.item.portionUsed;
    }
  }
};

component.state.price = function () {

    if (this.type === 'prep') {
      var item = getPrepItem(this.id);
      return Math.round(item.prepCostPerPortion * this.quantity * 100) / 100;
    }
    var item = getIngredientItem(this.id);
    return Math.round(item.costPerPortionUsed * this.quantity * 100) / 100;
};