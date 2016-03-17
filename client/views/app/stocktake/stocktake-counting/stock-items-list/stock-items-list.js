Template.stockItemsList.helpers({
  stockAreaIngredients: function () {
    return StockAreas.findOne({_id: this.specialAreaId}).ingredients;
  },

  getStockItemContext: function () {
    let templateContext = Template.parentData(1);
    let ingredientId = this;
    return {
      ingredient: Ingredients.findOne({_id: ingredientId}),
      stockItem: StockItems.findOne({'ingredient._id': ingredientId}),
      specialAreaId: templateContext.specialAreaId,
      isEditMode: templateContext.isEditMode
    }
  }
});