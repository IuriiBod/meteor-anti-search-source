Template.listOfStocksMasterMainView.onCreated(function () {
  this.onIngredientIdChange = function () {
    var self = this;

    return function (ingredient) {
      if (ingredient) {
        ingredient = Ingredients.findOne({_id: ingredient});
      }
      self.ingredientItemEditorModal = ModalManager.open('ingredientItemEditor', {ingredient: ingredient});
    }
  }
});

Template.listOfStocksMasterMainView.helpers({
  onIngredientIdChange: function () {
    return Template.instance().onIngredientIdChange();
  }
});