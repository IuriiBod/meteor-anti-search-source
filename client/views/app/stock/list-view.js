Template.listOfStocksMasterMainView.onCreated(function () {
  this.onIngredientIdChange = function () {
    return function (ingredient) {
      if (ingredient) {
        ingredient = Ingredients.findOne({_id: ingredient});
      }
      FlyoutManager.open('wrapperFlyout', {
        template:'ingredientEditor',
        title:"Add ingredient",
        data: {
          inFlyout: true,
          ingredient: null
        }
      });
    };
  };
});

Template.listOfStocksMasterMainView.helpers({
  onIngredientIdChange: function () {
    return Template.instance().onIngredientIdChange();
  }
});