Template.ingredientItemDetailed.onCreated(function () {
  this.set('item', this.data.ingredient);
});

Template.ingredientItemDetailed.events({
  'click .editIngredient': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onIngredientIdChange(tmpl.data.ingredient._id);
  }
});
