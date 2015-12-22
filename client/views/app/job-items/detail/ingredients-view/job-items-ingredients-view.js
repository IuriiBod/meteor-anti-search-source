Template.ingredientItemView.helpers({
  quantity: function () {
    return this.ingredient.quantity;
  },
  ingredient: function () {
    return Ingredients.findOne({_id: this.ingredient.id});
  },
  cost: function () {
    var ingredient = Ingredients.findOne({_id: this.ingredient.id});
    var analyzedIngredient = HospoHero.analyze.ingredient(ingredient);
    var cost = analyzedIngredient.costPerPortionUsed * this.ingredient.quantity;
    cost = Math.round(cost * 100) / 100;
    return cost;
  }
});