Template.ingredientItemView.onCreated(function () {
  this.data.ingredientItem = getIngredientItem(this.data.ingredient._id);
});

Template.ingredientItemView.helpers({
  quantity: function () {
    return Template.instance().data.ingredient.quantity
  },
  cost: function () {
    var ing = Template.instance().data.ingredientItem;
    var cost = ing.costPerPortionUsed * Template.instance().data.ingredient.quantity;
    cost = HospoHero.misc.rounding(cost);
    return cost;
  }
});