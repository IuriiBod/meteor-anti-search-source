ActualCostOfGoodsReporter = class {
  constructor() {

  }

  getReport() {
    return StocktakesReporter.roundReportValues({
      amount: this._getTotalActuallyUsedAmount(),
      ratio: this._getTotalActuallyUsedRatio()
    });
  }

  _getTotalActuallyUsedAmount() {
    return 1350;
  }

  _getTotalActuallyUsedRatio() {
    return 35.71;
  }
};