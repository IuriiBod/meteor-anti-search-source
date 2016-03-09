Template.listOfStocksMasterMainView.onCreated(function () {
  this.onIngredientIdChange = function () {
    return function (ingredient) {
      if (ingredient) {
        ingredient = Ingredients.findOne({_id: ingredient});
      }
      FlyoutManager.open('ingredientEditor', {ingredient: ingredient});
    };
  };
});

Template.listOfStocksMasterMainView.helpers({
  onIngredientIdChange: function () {
    return Template.instance().onIngredientIdChange();
  }
});