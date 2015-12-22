Template.ingredientItemEditorButtons.onCreated(function () {
  this.changeIngredientState = function (newState) {
    Meteor.call("archiveIngredient", this.data.ingredient._id, newState, HospoHero.handleMethodResult(function () {
      $("#ingredientItemEditor").modal("hide");

      var text = "Stock item";
      if (newState == "restore") {
        text += " restored";
      } else if (newState == "archive") {
        text += " archived";
      } else {
        text += " removed";
      }

      HospoHero.info(text);
    }));
  };
});

Template.ingredientItemEditorButtons.events({
  'click .submit-ingredient-button': function (event, tmpl) {
    event.preventDefault();

    var modalElement = $(event.target).closest('#ingredientItemEditor');
    var $form = $(modalElement.find('#submitIngredientForm'));
    $form.submit();
  },

  'click .archive-button': function (event, tmpl) {
    tmpl.changeIngredientState('archive');
  },
  'click .restore-button': function (event, tmpl) {
    tmpl.changeIngredientState('restore');
  },
  'click .delete-button': function (event, tmpl) {
    if (confirm('Are you sure you want to delete this ingredient?')) {
      tmpl.changeIngredientState('delete');
    }
  }
});