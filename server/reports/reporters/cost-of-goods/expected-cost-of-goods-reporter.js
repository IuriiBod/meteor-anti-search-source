ExpectedCostOfGoodsReporter = class {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   */
  constructor(fromDate, toDate) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.dateQuery = TimeRangeQueryBuilder.forInterval(moment(fromDate, 'DD/MM/YY'), moment(toDate, 'DD/MM/YY'));
  }

  getReport() {
    return StocktakesReporter.roundReportValues({
      amount: this._getTotalExpectedCost(),
      ratio: this._getTotalExpectedRatio()
    });
  }

  _getTotalExpectedCost() {
    return this._sumMenuItemProperty((menuItem) => {
      return this._getExpectedCostForMenuItem(menuItem);
    });
  }

  _getTotalExpectedRatio() {
    return 100 * this._getTotalExpectedCost() / this._getTotalRevenue();
  }

  _getTotalRevenue() {
    return this._sumMenuItemProperty((menuItem) => {
      return this._getRevenueForMenuItem(menuItem);
    });
  }

  _getRevenueForMenuItem(menuItem) {
    let tax = menuItem.salePrice * 0.1;
    return menuItem.soldAmount * (menuItem.salePrice - tax);
  }

  _getExpectedCostForMenuItem(menuItem) {
    return menuItem.soldAmount * (menuItem.totalIngredientCost + menuItem.totalPreparationCost);
  }

  _sumMenuItemProperty(mapFunction) {
    let sumFunction = (memo, value) => memo + value;
    return _.chain(this._getMenuItems())
      .map(mapFunction)
      .reduce(sumFunction, 0)
      .value();
  }

  _getMenuItems() {
    return [
      {
        soldAmount: 100,
        totalIngredientCost: 3.44,
        totalPreparationCost: 2.87,
        salePrice: 20
      },
      {
        soldAmount: 110,
        totalIngredientCost: 3.22,
        totalPreparationCost: 2.5,
        salePrice: 20
      }
    ]
  }
};