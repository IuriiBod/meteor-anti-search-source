Template.listOfStocksMasterMainView.onCreated(function () {
  this.set('ingredientItemEditorExist', null);

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
  templateData: function () {
    return {
      onIngredientIdChange: Template.instance().onIngredientIdChange()
    }
  },

  onIngredientIdChange: function () {
    return Template.instance().onIngredientIdChange();
  }
});