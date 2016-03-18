Template.stockItemsList.helpers({
  stockAreaIngredients: function () {
    return StockAreas.findOne({_id: this.specialAreaId}).ingredientsIds;
  },

  getStockItemContext: function () {
    let templateContext = Template.parentData(1);
    let ingredientId = this.toString();
    return {
      stocktakeId: templateContext.stocktakeId,
      ingredient: Ingredients.findOne({_id: ingredientId}),
      specialAreaId: templateContext.specialAreaId,
      isEditMode: templateContext.isEditMode
    }
  }
});