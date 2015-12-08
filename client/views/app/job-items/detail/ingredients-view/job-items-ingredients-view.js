Template.ingredientItemView.onCreated(function () {
  this.usedIngredient = this.data.ingredient;
  this.ingredientItem = getIngredientItem(this.usedIngredient._id);
});

Template.ingredientItemView.helpers({
  ing: function () {
    return Template.instance().ingredientItem;
  },
  quantity: function () {
    return Template.instance().usedIngredient.quantity
  },
  cost: function () {
    var ing = Template.instance().ingredientItem;
    if (ing) {
      var cost = ing.costPerPortionUsed * Template.instance().usedIngredient.quantity;
      cost = Math.round(cost * 100) / 100;
      return cost;
    }
  }
});