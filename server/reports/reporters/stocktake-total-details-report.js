StocktakeTotalDetailedReport = class {
  constructor(stocktakeGroup) {
    this._stocktakeGroup = stocktakeGroup;
  }

  getReport() {
    return this._stocktakeGroup.map((stock) => {
      let stockItem = Ingredients.findOne({_id: stock.stockId});
      return {
        description: stockItem.description,
        stockTotalValue: HospoHero.misc.rounding(stock.counting * stock.unitCost, 100)
      }
    });
  }
};
