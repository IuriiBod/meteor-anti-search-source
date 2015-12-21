Template.ingredientItemView.onCreated(function () {
  this.data.ingredientItem = getIngredientItem(this.data.ingredient.id);
});

Template.ingredientItemView.helpers({
  quantity: function () {
    return Template.instance().data.ingredient.quantity
  },
  cost: function () {
    var ing = Template.instance().data.ingredientItem;
    var cost = ing.costPerPortionUsed * Template.instance().data.ingredient.quantity;
    cost = Math.round(cost * 100) / 100;
    return cost;
  }
});