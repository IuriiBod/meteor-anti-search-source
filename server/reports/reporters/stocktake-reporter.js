StocktakesReporter = class {
  constructor(stocktakeGroups, areaId) {
    this._firstStocktakeItems = stocktakeGroups.firstStocktake.stockItems;
    this._secondStocktakeItems = stocktakeGroups.secondStocktake.stockItems;
    this._fromDate = stocktakeGroups.firstStocktake.date;
    this._toDate = stocktakeGroups.secondStocktake.date;
    this._areaId = areaId;

    this._menuItemsCache = new MenuItemsCostCache(this._areaId);
  }

  getReport() {
    let ordersReporter = new OrdersReporter(this._getStocktakeIdsFromStockItem(), this._areaId);
    let expectedReporter = new ExpectedCostOfGoodsReporter(this._fromDate, this._toDate, this._areaId);
    let actualReporter = new ActualCostOfGoodsReporter(
      this._firstStocktakeItems,
      this._secondStocktakeItems,
      expectedReporter.getTotalRevenue(),
      ordersReporter.getTotalOrdersReceived()
    );

    let expectedReport = expectedReporter.getReport();
    let actualReport = actualReporter.getReport();

    return {
      firstStocktake: {
        stocktakeId: this._firstStocktakeItems[0].stocktakeId,
        date: this._fromDate,
        total: actualReporter.firstStocktakeTotal
      },
      secondStocktake: {
        stocktakeId: this._secondStocktakeItems[0].stocktakeId,
        date: this._toDate,
        total: actualReporter.secondStocktakeTotal
      },
      totalOrdersReceived: ordersReporter.getTotalOrdersReceived(),
      costOfGoods: {
        expected: expectedReport,
        actual: actualReport
      },
      difference: this._getExpectedActualDifference(actualReport, expectedReport)
    };
  }

  _getStocktakeIdsFromStockItem() {
    let firstStocktakeId = this._firstStocktakeItems[0].stocktakeId;
    let secondStocktakeId = this._secondStocktakeItems[0].stocktakeId;

    return [firstStocktakeId, secondStocktakeId];
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
    };
  }
};