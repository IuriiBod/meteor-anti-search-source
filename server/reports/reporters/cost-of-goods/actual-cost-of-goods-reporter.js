ActualCostOfGoodsReporter = class {
  constructor(totalRevenue) {
    this._totalRevenue = totalRevenue;
  }

  getReport() {
    return StocktakesReporter.roundReportValues({
      amount: this._getTotalActuallyUsedAmount(),
      ratio: this._getTotalActuallyUsedRatio()
    });
  }

  _getTotalActuallyUsedAmount() {
    return this._getTotalAmountOrdersReceived()
      + (this._getFirstStocktakeTotal() - this._getSecondStocktakeTotal());
  }

  _getFirstStocktakeTotal() {
    return 3000;
  }

  _getSecondStocktakeTotal() {
    return 2000;
  }

  _getTotalAmountOrdersReceived() {
    return 350;
  }

  _getTotalActuallyUsedRatio() {
    return 100 * this._getTotalActuallyUsedAmount() / this._totalRevenue;
  }
};