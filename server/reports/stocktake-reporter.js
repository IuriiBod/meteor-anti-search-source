StocktakesReporter = class {
  constructor(firstStocktakeGroup, secondStocktakeGroup) {
    this.firstStocktakeGroup = firstStocktakeGroup;
    this.secondStocktakeGroup = secondStocktakeGroup;

    this._setDates();
  }

  _setDates() {
    let formatDate = HospoHero.dateUtils.formatTimestamp;
    this.fromDate = formatDate(this.firstStocktakeGroup[0].date);
    this.toDate = formatDate(this.secondStocktakeGroup[0].date);
  }

  getReport() {
    let expectedCostOfGoodsReport = new ExpectedCostOfGoodsReporter(this.fromDate, this.toDate).getReport();
    let actualCostOfGoodsReport = new ActualCostOfGoodsReporter().getReport();

    return {
      firstStocktake: {
        date: this.fromDate,
        total: 3000
      },
      secondStocktake: {
        date: this.toDate,
        total: 2000
      },
      totalOrdersReceived: 500,
      costOfGoods: {
        expected: expectedCostOfGoodsReport,
        actual: actualCostOfGoodsReport
      },
      difference: this._getExpectedActualDifference(actualCostOfGoodsReport, expectedCostOfGoodsReport)
    }
  }

  _getExpectedActualDifference(actualCostOfGoodsReport, expectedCostOfGoodsReport) {
    return StocktakesReporter.roundReportValues({
      amount: actualCostOfGoodsReport.amount - expectedCostOfGoodsReport.amount,
      ratio: actualCostOfGoodsReport.ratio - expectedCostOfGoodsReport.ratio
    });
  }

  static roundReportValues(report) {
    return {
      amount: HospoHero.misc.rounding(report.amount, 10),
      ratio: HospoHero.misc.rounding(report.ratio, 100)
    }
  }
};