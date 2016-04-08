ActualCostOfGoodsReporter = class {
  constructor(firstStocktakeGroup, secondStocktakeGroup, totalRevenue, ordersReceived) {
    this._firstStocktakeGroup = firstStocktakeGroup;
    this._secondStocktakeGroup = secondStocktakeGroup;
    this._totalRevenue = totalRevenue;
    this._ordersReceived = ordersReceived;

    this._setTotalValues();
  }

  _setTotalValues() {
    this._firstStocktakeTotalValue = this._getTotalStocktakesGroupValue(this._firstStocktakeGroup);
    this._secondStocktakeTotalValue = this._getTotalStocktakesGroupValue(this._secondStocktakeGroup);
  }

  getReport() {
    return StocktakesReporter.roundReportValues({
      amount: this._getTotalActualCost(),
      ratio: this._getTotalActualRatio()
    });
  }

  get firstStocktakeTotal() {
    return this._firstStocktakeTotalValue;
  }

  get secondStocktakeTotal() {
    return this._secondStocktakeTotalValue;
  }

  _getTotalActualCost() {
    return this._getTotalAmountOrdersReceived() +
      this.firstStocktakeTotal - this.secondStocktakeTotal;
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
};