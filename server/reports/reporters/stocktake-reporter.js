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
    let expectedReporter = new ExpectedCostOfGoodsReporter(this.fromDate, this.toDate);
    let actualReporter = new ActualCostOfGoodsReporter(expectedReporter.getTotalRevenue());

    let expectedReport = expectedReporter.getReport();
    let actualReport = actualReporter.getReport();

    return {
      firstStocktake: {
        date: this.fromDate,
        total: actualReporter.getFirstStocktakeTotal()
      },
      secondStocktake: {
        date: this.toDate,
        total: actualReporter.getSecondStocktakeTotal()
      },
      totalOrdersReceived: 500,
      costOfGoods: {
        expected: expectedReport,
        actual: actualReport
      },
      difference: this._getExpectedActualDifference(actualReport, expectedReport)
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