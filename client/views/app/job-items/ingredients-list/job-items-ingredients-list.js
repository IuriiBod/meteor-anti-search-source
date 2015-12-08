Template.listOfIngredients.helpers({
  ingredientsList: function () {
    var localId = Session.get("localId");
    var ids = [];
    if (localId) {
      if (this.id == "menuSubmit") {
        var localMenuItem = LocalMenuItem.findOne(localId);
        if (localMenuItem && localMenuItem.ings.length > 0) {
          ids = localMenuItem.ings;
        }
      } else {
        var localJobItem = LocalJobItem.findOne(localId);
        if (localJobItem && localJobItem.ings.length > 0) {
          ids = localJobItem.ings;
        }
      }
    }
    return ids;
  },

  isMenu: function () {
    return Template.instance().data.id == "menuSubmit";
  },

  name: function () {
    return Template.instance().data.name;
  },

  id: function () {
    return Session.get("thisJobItem");
  }
});

Template.listOfIngredients.events({
  'click #showIngredientsList': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#ingredientsListModal").modal("show");
  }
});