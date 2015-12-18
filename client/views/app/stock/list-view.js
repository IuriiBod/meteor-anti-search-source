Template.listOfStocksMasterMainView.onCreated(function () {
  this.set('ingredientItemEditorExist', null);

  this.onIngredientIdChange = function () {
    var self = this;

    return function (ingredient) {
      if (ingredient) {
        ingredient = Ingredients.findOne({_id: ingredient});
      }

      if (self.get('ingredientItemEditorExist')) {
        Blaze.remove(self.get('ingredientItemEditorExist'));
      }
      var ingredientEditorBlazeView = Blaze.renderWithData(Template.ingredientItemEditor, {
        isModal: true,
        ingredient: ingredient
      }, document.getElementById('ingredientItemEditorPlaceHolder'));

      self.set('ingredientItemEditorExist', ingredientEditorBlazeView);
      self.$("#ingredientItemEditor").modal("show");
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