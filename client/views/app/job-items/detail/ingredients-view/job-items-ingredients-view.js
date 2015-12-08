Template.ingredientItemView.onCreated(function () {
  console.log('ingredientItemView defined\n', this);
  this.ingredient = this.data.ingredient;

  this.ingredientItem = getIngredientItem(this.ingredient._id);
});

Template.ingredientItemView.helpers({
  ing: function () {
    return Template.instance().ingredientItem;
  },
  quantity: function () {
    if (Template.instance().ingredient && Template.instance().ingredient.quantity) {
      return Template.instance().ingredient.quantity;
    }
  },
  cost: function () {
    var ing = Template.instance().ingredientItem;
    if (ing) {
      var cost = ing.costPerPortionUsed * Template.instance().ingredient.quantity;
      cost = Math.round(cost * 100) / 100;
      return cost;
    }
  }
});