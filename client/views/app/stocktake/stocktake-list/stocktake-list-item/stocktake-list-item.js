Template.stocktakeListItem.helpers({
  totalStocktakeCost: function () {
    let totalStocktakeCost = 0;
    StockItems.find({stocktakeId: this._id}).forEach((stockItem) => {
      totalStocktakeCost += stockItem.count * stockItem.ingredient.costPerPortion
    });
    return totalStocktakeCost;
  }
});