Template.ingredientItemView.onCreated(function () {
  this.ingredient = Ingredients.findOne({_id: this.data.ingredient._id});
});

Template.ingredientItemView.helpers({
  quantity: function () {
    return this.ingredient.quantity;
  },
  ingredient: function () {
    return Template.instance().ingredient;
  },
  cost: function () {
    var ingredient = Template.instance().ingredient;
    var analyzedIngredient = HospoHero.analyze.ingredient(ingredient);
    var cost = analyzedIngredient.costPerPortionUsed * this.ingredient.quantity;
    return HospoHero.misc.rounding(cost);
  }
});