class StocktakesReporter {
  constructor(stocktakeGroups, areaId) {
    this._firstStocktakeItems = stocktakeGroups.firstStocktake.stockItems;
    this._secondStocktakeItems = stocktakeGroups.secondStocktake.stockItems;
    this._fromDate = stocktakeGroups.firstStocktake.date;
    this._toDate = stocktakeGroups.secondStocktake.date;
    this._areaId = areaId;

    this._menuItemsCache = new HospoHero.reporting.MenuItemsCostCache(this._areaId);
  }

  getReport() {
    let ordersReporter = new HospoHero.reporting.OrdersReporter(this._getStocktakeIdsFromStockItem(), this._areaId);
    let expectedReporter = new HospoHero.reporting.ExpectedCostOfGoodsReporter(this._fromDate, this._toDate, this._areaId);

    let actualReporter = new HospoHero.reporting.ActualCostOfGoodsReporter(
      this._firstStocktakeItems,
      this._secondStocktakeItems,
      expectedReporter.getTotalRevenue(),
      ordersReporter.getTotalOrdersReceived()
    );

    let expectedReport = expectedReporter.getReport();
    let actualReport = actualReporter.getReport();
    let actualStocktakesTotals = actualReporter.getStocktakesTotals();

    return {
      firstStocktake: {
        stocktakeId: this._firstStocktakeItems[0].stocktakeId,
        date: this._fromDate,
        total: actualStocktakesTotals.first
      },
      secondStocktake: {
        stocktakeId: this._secondStocktakeItems[0].stocktakeId,
        date: this._toDate,
        total: actualStocktakesTotals.second
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
    let round = HospoHero.misc.rounding;
    return {
      amount: round(actualCostOfGoodsReport.amount - expectedCostOfGoodsReport.amount, 10),
      ratio: round(actualCostOfGoodsReport.ratio - expectedCostOfGoodsReport.ratio, 100)
    };
  }
}


Namespace('HospoHero.reporting', {
  StocktakesReporter: StocktakesReporter
});