Template.ingredientItemDetailed.events({
  'click .editIngredient': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    //todo: use new ingredientEditor API here
    //see: https://trello.com/c/OKnGRuGb/431-editingredientitem-submitingredientbody-submitingredient-will-be-replaced-with-ingredientitemeditor
    Session.set("thisIngredientId", id);
    $("#editIngredientModal").modal("show");
  },

  'click .archiveIngredient': function (e, tpl) {
    e.preventDefault();
    var button, i, id;
    if ($(e.target).hasClass('archiveIngredient')) {
      button = $(e.target);
    } else {
      i = $(e.target);
      button = i.parent();
    }
    id = button.parent().parent().attr("data-id");
    Meteor.call("archiveIngredient", id, HospoHero.handleMethodResult());
    IngredientsListSearch.cleanHistory();
    var selector = {
      limit: 30
    };
    if (Router.current().params.type) {
      selector.status = "archived";
    } else {
      selector.status = {$ne: "archived"};
    }
    IngredientsListSearch.search("", selector);
  }
});
