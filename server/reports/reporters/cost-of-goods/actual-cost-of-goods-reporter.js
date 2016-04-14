class ActualCostOfGoodsReporter {
  constructor(firstStocktakeGroup, secondStocktakeGroup, totalRevenue, ordersReceived) {
    this._firstStocktakeGroup = firstStocktakeGroup;
    this._secondStocktakeGroup = secondStocktakeGroup;
    this._totalRevenue = totalRevenue;
    this._ordersReceived = ordersReceived;

    this._firstStocktakeTotalValue = this._getTotalStocktakesGroupValue(this._firstStocktakeGroup);
    this._secondStocktakeTotalValue = this._getTotalStocktakesGroupValue(this._secondStocktakeGroup);
  }

  getStocktakesTotals() {
    return {
      first: this._firstStocktakeTotalValue,
      second: this._secondStocktakeTotalValue
    };
  }

  getReport() {
    return {
      amount: HospoHero.misc.rounding(this._getTotalActualCost(), 10),
      ratio: HospoHero.misc.rounding(this._getTotalActualRatio(), 100)
    };
  }

  _getTotalActualCost() {
    return this._getTotalAmountOrdersReceived() +
      this._firstStocktakeTotalValue - this._secondStocktakeTotalValue;
  }

  _getTotalAmountOrdersReceived() {
    return this._ordersReceived;
  }

  _getTotalActualRatio() {
    return 100 * this._getTotalActualCost() / (this._totalRevenue || 1);
  }

  _getTotalStocktakesGroupValue(stocktakesGroup) {
    let stocktakeTotalValue = _.reduce(stocktakesGroup, (memo, stocktake) => {
      return memo + (stocktake.count * stocktake.ingredient.cost);
    }, 0);
    return HospoHero.misc.rounding(stocktakeTotalValue, 100);
  }
}

Namespace('HospoHero.reporting', {
  ActualCostOfGoodsReporter: ActualCostOfGoodsReporter
});