Template.ingredientItemEditor.helpers({
  isIngredientSet: function () {
    return this.ingredient && Object.keys(this.ingredient).length > 0;
  }
});
