CostOfGoodsReporter = class {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   */
  constructor(fromDate, toDate) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.dateQuery = TimeRangeQueryBuilder.forInterval(moment(fromDate, 'DD/MM/YY'), moment(toDate, 'DD/MM/YY'))
  }

  getReport() {
    return {
      expected: {
        amount: this._getTotalExpectedCost(),
        ratio: this._getTotalExpectedRation()
      },
      actual: {
        amount: 1000,
        ratio: 26.46
      }
    }
  }

  _getTotalExpectedCost() {
    return _.chain(this._getMenuItems())
      .map((menuItem) => {
        return this._getExpectedCostForMenuItem(menuItem);
      })
      .reduce((memo, value) => memo + value, 0)
      .value();
  }

  _getTotalExpectedRation() {
    return 31.83;
  }

  _getExpectedCostForMenuItem(menuItem) {
    return menuItem.soldAmount * (menuItem.totalIngredientCost + menuItem.totalPreparationCost);
  }

  _getMenuItems() {
    return [
      {
        soldAmount: 100,
        totalIngredientCost: 3.44,
        totalPreparationCost: 2.87
      },
      {
        soldAmount: 100,
        totalIngredientCost: 3.22,
        totalPreparationCost: 2.5
      }
    ]
  }
};