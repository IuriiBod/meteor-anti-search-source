StocktakesReporter = class {
  constructor(firstStocktake, secondStocktake, areaId) {
    this._areaId = areaId;
    this._firstStocktakeMainId = firstStocktake.stocktakeMainId;
    this._secondStocktakeMainId = secondStocktake.stocktakeMainId;
    this._firstStocktakeGroup = firstStocktake.group;
    this._secondStocktakeGroup = secondStocktake.group;

    this._setDates();
  }

  _setDates() {
    let formatDate = HospoHero.dateUtils.formatTimestamp;
    this._fromDate = formatDate(this._secondStocktakeGroup[0].date);
    this._toDate = formatDate(this._firstStocktakeGroup[0].date);
  }

  getReport() {
    let ordersReporter = new OrdersReporter(this._fromDate, this._toDate, this._areaId);
    let expectedReporter = new ExpectedCostOfGoodsReporter(this._fromDate, this._toDate, this._areaId);
    let actualReporter = new ActualCostOfGoodsReporter(
      this._firstStocktakeGroup,
      this._secondStocktakeGroup,
      expectedReporter.getTotalRevenue(),
      ordersReporter.getTotalOrdersReceived()
    );

    let expectedReport = expectedReporter.getReport();
    let actualReport = actualReporter.getReport();

    return {
      firstStocktake: {
        stocktakeMainId: this._firstStocktakeMainId,
        date: this._fromDate,
        total: actualReporter.firstStocktakeTotal
      },
      secondStocktake: {
        stocktakeMainId: this._secondStocktakeMainId,
        date: this._toDate,
        total: actualReporter.secondStocktakeTotal
      },
      totalOrdersReceived: ordersReporter.getTotalOrdersReceived(),
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