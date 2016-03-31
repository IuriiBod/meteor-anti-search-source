Template.listOfStocksMasterMainView.onCreated(function () {
  this.onIngredientIdChange = function () {
    return function (ingredient) {
      if (ingredient) {
        ingredient = Ingredients.findOne({_id: ingredient});
      }
      FlyoutManager.open('wrapperFlyout', {
        template: 'ingredientEditor',
        title: (ingredient ? 'Edit' : 'Add') + " ingredient",
        data: {
          inFlyout: true,
          editMode: ingredient !== undefined,
          ingredient: ingredient
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