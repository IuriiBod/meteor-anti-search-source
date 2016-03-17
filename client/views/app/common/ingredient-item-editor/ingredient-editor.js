//context: ingredient (Ingredient/undefined)
Template.ingredientEditor.onCreated(function () {
  if (!(_.isObject(this.data.ingredient))) {
    this.subscribe('ingredient', this.data.ingredient);
  }
});

Template.ingredientEditor.helpers({
  ingredient() {
    let ingredient;
    if (_.isObject(this.ingredient)) {
      ingredient = this.ingredient;
    } else {
      ingredient = Ingredients.findOne({_id: this.ingredient});
    }

    return ingredient;
  }
});