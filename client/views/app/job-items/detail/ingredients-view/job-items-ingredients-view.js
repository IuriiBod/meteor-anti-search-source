Template.ingredientItemView.helpers({
  quantity: function () {
    return this.ingredient.quantity;
  },
  ingredient: function () {
    return Ingredients.findOne({_id: this.ingredient.id});
  },
  cost: function () {
    var ing = getIngredientItem(this.ingredient.id);
    var cost = ing.costPerPortionUsed * this.ingredient.quantity;
    cost = Math.round(cost * 100) / 100;
    return cost;
  }
});