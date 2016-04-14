class ExpectedCostOfGoodsReporter {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   * @param {string} areaId
   */
  constructor(fromDate, toDate, areaId) {
    this._fromDate = fromDate;
    this._toDate = toDate;
    this._areaId = areaId;

    this._menuSalesAndCostComposition = this._getDailySalesMenuItemCostComposition();

    this._totalRevenue = this._calculateTotalRevenue();
    this._totalExpectedCost = this._calculateTotalExpectedCost();
    this._totalExpectedRatio = this._calculateTotalExpectedRatio();
  }

  getTotalRevenue() {
    return this._totalRevenue;
  }

  getReport() {
    return {
      amount: HospoHero.misc.rounding(this._totalExpectedCost, 10),
      ratio: HospoHero.misc.rounding(this._totalExpectedRatio, 100)
    };
  }

  _calculateTotalRevenue() {
    return this._sumCompositionProperty((menuItem) => {
      let tax = menuItem.salePrice * 0.1;
      return menuItem.actualQuantity * (menuItem.salePrice - tax);
    });
  }

  _calculateTotalExpectedCost() {
    return this._sumCompositionProperty((menuItem) => {
      return menuItem.actualQuantity * (menuItem.totalIngredientCost + menuItem.totalPreparationCost);
    });
  }

  _calculateTotalExpectedRatio() {
    return 100 * this._totalExpectedCost / (this._totalRevenue || 1);
  }

  _sumCompositionProperty(mapFunction) {
    let sumFunction = (memo, value) => memo + value;

    return _.chain(this._menuSalesAndCostComposition)
      .map(mapFunction)
      .reduce(sumFunction, 0)
      .value();
  }

  _getDailySalesMenuItemCostComposition() {
    let menuItemsCostCache = new HospoHero.reporting.MenuItemsCostCache(this._areaId);

    let findQuery = {
      date: this._dateQuery(),
      actualQuantity: {$exists: true},
      'relations.areaId': this._areaId
    };

    let queryOptions = {
      fields: {
        _id: 0,
        menuItemId: 1,
        actualQuantity: 1
      }
    };

    return DailySales.find(findQuery, queryOptions).map((dailySale) => {
      let menuItemCosts = menuItemsCostCache.lookup(dailySale.menuItemId);
      return _.extend(dailySale, menuItemCosts);
    });
  }

  _dateQuery() {
    let fromDate = this._fromDate > this._toDate ? this._toDate : this._fromDate;
    let toDate = fromDate === this._fromDate ? this._toDate : this._fromDate;

    return TimeRangeQueryBuilder.forInterval(fromDate, toDate);
  }
}

Namespace('HospoHero.reporting', {
  ExpectedCostOfGoodsReporter: ExpectedCostOfGoodsReporter
});