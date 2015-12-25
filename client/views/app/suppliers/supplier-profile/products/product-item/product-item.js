Template.productItem.helpers({
  ingredient: function () {
    return Ingredients.findOne({_id: this.ingredientId});
  }
});