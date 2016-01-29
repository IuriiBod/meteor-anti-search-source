StocktakesReporter = class {
  constructor(firstStocktakeGroup, secondStocktakeGroup) {
    this._firstStocktakeGroup = firstStocktakeGroup;
    this._secondStocktakeGroup = secondStocktakeGroup;

    this._setDates();
  }

  _setDates() {
    let formatDate = HospoHero.dateUtils.formatTimestamp;
    this._fromDate = formatDate(this._firstStocktakeGroup[0].date);
    this._toDate = formatDate(this._secondStocktakeGroup[0].date);
  }

  getReport() {
    let expectedReporter = new ExpectedCostOfGoodsReporter(this._fromDate, this._toDate);
    let actualReporter = new ActualCostOfGoodsReporter(this._firstStocktakeGroup, this._secondStocktakeGroup, expectedReporter.getTotalRevenue());

    let expectedReport = expectedReporter.getReport();
    let actualReport = actualReporter.getReport();

    return {
      firstStocktake: {
        date: this._fromDate,
        total: actualReporter.getFirstStocktakeTotal()
      },
      secondStocktake: {
        date: this._toDate,
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