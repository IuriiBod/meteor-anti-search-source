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
      + (this.getFirstStocktakeTotal() - this.getSecondStocktakeTotal());
  }

  getFirstStocktakeTotal() {
    return 3000;
  }

  getSecondStocktakeTotal() {
    return 2000;
  }

  _getTotalAmountOrdersReceived() {
    return 350;
  }

  _getTotalActuallyUsedRatio() {
    return 100 * this._getTotalActuallyUsedAmount() / this._totalRevenue;
  }
};