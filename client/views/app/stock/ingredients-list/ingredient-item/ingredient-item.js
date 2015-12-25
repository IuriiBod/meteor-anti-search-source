Template.ingredientItemDetailed.events({
  'click .editIngredient': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onIngredientIdChange(tmpl.data.ingredient._id);
  }
});
