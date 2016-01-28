CostOfGoodsReporter = class {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   */
  constructor(fromDate, toDate) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.dateQuery = TimeRangeQueryBuilder.forInterval(moment(fromDate, 'DD/MM/YY'), moment(toDate, 'DD/MM/YY'));
    this.sumPredicate = (memo, value) => memo + value;
  }

  getReport() {
    return {
      expected: {
        amount: this._getTotalExpectedCost(),
        ratio: this._getTotalExpectedRatio()
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
      .reduce(this.sumPredicate, 0)
      .value();
  }

  _getTotalExpectedRatio() {
    let totalExpectedRatio = 100 * this._getTotalExpectedCost() / this._getTotalRevenue();
    totalExpectedRatio = HospoHero.misc.rounding(totalExpectedRatio, 100);
    return totalExpectedRatio;
  }

  _getTotalRevenue() {
    return _.chain(this._getMenuItems())
      .map((menuItem) => {
        return this._getRevenueForMenuItem(menuItem);
      })
      .reduce(this.sumPredicate, 0)
      .value();
  }

  _getRevenueForMenuItem(menuItem) {
    return menuItem.soldAmount * menuItem.salePrice;
  }

  _getExpectedCostForMenuItem(menuItem) {
    return menuItem.soldAmount * (menuItem.totalIngredientCost + menuItem.totalPreparationCost);
  }

  _getMenuItems() {
    return [
      {
        soldAmount: 100,
        totalIngredientCost: 3.44,
        totalPreparationCost: 2.87,
        salePrice: 18
      },
      {
        soldAmount: 110,
        totalIngredientCost: 3.22,
        totalPreparationCost: 2.5,
        salePrice: 18
      }
    ]
  }
};