Template.stockTakeMasterList.helpers({
  stocktakes: function () {
    let getTotalStockItemsCost = (stockItemsGroup) => {
      return _.reduce(stockItemsGroup, (memo, stockItem) => {
        return memo + (stockItem.count * stockItem.ingredient.costPerPortion);
      }, 0);
    };

    var stockItems = StockItems.find({}).fetch();

    var groupedStockItems = _.groupBy(stockItems, 'stocktakeId');

    return _.map(groupedStockItems, (stockItemsGroup, stocktakeId) => {
      return {
        _id: stocktakeId,
        date: stockItemsGroup[0].date,
        totalStockValue: getTotalStockItemsCost(stockItemsGroup)
      };
    });
  }
});