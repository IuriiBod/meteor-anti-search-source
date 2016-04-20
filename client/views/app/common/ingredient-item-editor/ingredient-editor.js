//context: ingredient (Ingredient/null) or ingredientId (ID<Ingredient>)
Template.ingredientEditor.onCreated(function () {
  if (this.data.ingredientId) {
    this.subscribe('ingredient', this.data.ingredientId);
  }
});

Template.ingredientEditor.helpers({
  ingredient() {
    let ingredient;
    if (this.ingredientId) {
      ingredient = Ingredients.findOne({_id: this.ingredientId});
    } else {
      ingredient = this.ingredient;
    }
    return ingredient;
  }
});