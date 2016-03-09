let _renameObjectProperty = function (object, oldKeyName, newKeyName) {
  object[newKeyName] = object[oldKeyName];
  delete object[oldKeyName];
  return object;
};

ExpectedCostOfGoodsReporter = class {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   * @param {string} areaId
   */
  constructor(fromDate, toDate, areaId) {
    this._fromDate = fromDate;
    this._toDate = toDate;
    this._areaId = areaId;

    this._dateQuery = TimeRangeQueryBuilder.forInterval(moment(fromDate, 'DD/MM/YY'), moment(toDate, 'DD/MM/YY'));

    this._menuItemsCostCache = new MenuItemsCostCache(areaId);
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
    return 100 * this._getTotalExpectedCost() / (this.getTotalRevenue() || 1);
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
    let findQuery = {
      date: this._dateQuery,
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

    let menuItemsSales = DailySales.find(findQuery, queryOptions).fetch();
    return _.map(menuItemsSales, (item) => {
      return _renameObjectProperty(item, 'actualQuantity', 'soldAmount');
    });
  }

  _getMenuItemCost(menuItemId) {
    return this._menuItemsCostCache.lookup(menuItemId);
  }
};