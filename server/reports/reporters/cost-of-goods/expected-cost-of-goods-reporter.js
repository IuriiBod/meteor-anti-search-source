ExpectedCostOfGoodsReporter = class {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   */
  constructor(fromDate, toDate) {
    this._fromDate = fromDate;
    this._toDate = toDate;
    this._dateQuery = TimeRangeQueryBuilder.forInterval(moment(fromDate, 'DD/MM/YY'), moment(toDate, 'DD/MM/YY'));
  }

  getReport() {
    return StocktakesReporter.roundReportValues({
      amount: this._getTotalExpectedCost(),
      ratio: this._getTotalExpectedRatio()
    });
  }

  getTotalRevenue() {
    return this._sumMenuItemProperty((menuItem) => {
      return this._getRevenueForMenuItem(menuItem);
    });
  }

  _getTotalExpectedCost() {
    return this._sumMenuItemProperty((menuItem) => {
      return this._getExpectedCostForMenuItem(menuItem);
    });
  }

  _getTotalExpectedRatio() {
    return 100 * this._getTotalExpectedCost() / this.getTotalRevenue();
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
    let soldAmountMenuItems = this._getSoldAmountMenuItems();
    return _.map(soldAmountMenuItems, (item) => {
      return _.extend(item, this._getMenuItemCost(item.menuItemId));
    });
  }

  _getSoldAmountMenuItems() {
    return [
      {
        soldAmount: 100,
        menuItemId: 'WGCBpZzzPb5ZRn4gN'
      },
      {
        soldAmount: 110,
        menuItemId: 'XrXkqcvZZQ8viZCeY'
      }
    ]
  }

  _getMenuItemCost(menuItemId) {
    return {
      totalIngredientCost: 3.44,
      totalPreparationCost: 2.87,
      salePrice: 20
    };
  }
};