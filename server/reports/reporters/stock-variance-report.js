StockVarianceReport = class {
  constructor(areaId, firstStocktakeGroup, secondStocktakeGroup) {
    this._areaId = areaId;
    this._firstStocktakeGroup = firstStocktakeGroup;
    this._secondStocktakeGroup = secondStocktakeGroup;

    this._initCache();
    this._cacheMenuItems();
    this._setDates();
  }

  _initCache() {
    this._ingredientsCache = new IngredientsFromArea(this._areaId);
  }

  _setDates() {
    let formatDate = HospoHero.dateUtils.formatTimestamp;
    this._fromDate = formatDate(this._firstStocktakeGroup[0].date);
    this._toDate = formatDate(this._secondStocktakeGroup[0].date);
  }

  _cacheMenuItems() {
    this._menuItemsCache = MenuItems.find({'relations.areaId': this._areaId}, {
      fields: {
        ingredients: 1,
        salesPrice: 1
      }
    }).fetch();
  }

  _getMenuItemsFromCache(menuItemId) {
    return _.findWhere(this._menuItemsCache, {_id: menuItemId});
  }

  _getFilteredItem(collection, key, keyForComparison) {
    return _.filter(collection, (collectionItem) => collectionItem[key] === keyForComparison);
  }

  getReport() {
    let expectedGostOfGoods = this._getTotalExpectedCostOfIngredient();
    let actualCostOfGoods = this._getActualCostOfGoods();
  }

  /**
   * Expected Cost Of Ingredients
   */
  _getTotalExpectedCostOfIngredient() {
    let stocks = this._expectedIngredientCostOfMenuItems();
    let stocksIds = _.uniq(_.pluck(stocks, '_id'));
    let expectedCostOfIngredient = [];

    stocksIds.forEach((stockId) => {
      let ingredientTotalExpectedCost = this._getFilteredItem(stocks, '_id', stockId)
          .reduce((memo, stock) => memo + stock.ingExpectedCost, 0);

      let stockFromCache = this._ingredientsCache.searchByIngredientId(stockId);

      if (stockFromCache) {
        expectedCostOfIngredient.push({
          stockId: stockFromCache.description,
          totalExpectedCost: ingredientTotalExpectedCost
        });
      }
    });

    return expectedCostOfIngredient;
  }

  _expectedIngredientCostOfMenuItems() {
    let menuItemSales = this._getForecastedMenuItemsSales();
    let stockItems = [];
    menuItemSales.forEach((menuItem) => {
      let menuItemDoc = this._getMenuItemsFromCache(menuItem.menuItemId);
      menuItemDoc.ingredients.forEach((ingredient) => {
        if (ingredient._id) {
          let ingExpectedCost = HospoHero.misc.rounding(menuItem.predictionQuantity * ingredient.quantity);
          stockItems.push({_id: ingredient._id, ingExpectedCost: ingExpectedCost});
        }
      });
    });

    return stockItems;
  }

  _getForecastedMenuItemsSales() {
    let date = TimeRangeQueryBuilder.forInterval(moment(this._fromDate, 'DD/MM/YY'), moment(this._toDate, 'DD/MM/YY'));
    let query = {
      date: date,
      'relations.areaId': this._areaId,
      predictionQuantity: {$exists: true}
    };

    let options = {
      fields: {
        _id: 0,
        menuItemId: 1,
        predictionQuantity: 1
      }
    };

    return DailySales.find(query, options).fetch();
  }

  /**
   * Actual Cost of Goods
   */

  _getActualCostOfGoods() {
    let firstStocktakeDetailedReport = this._getStocktakeDetailedReport(this._firstStocktakeGroup, this._areaId);
    let secondStocktakeDetailedReport = this._getStocktakeDetailedReport(this._secondStocktakeGroup, this._areaId);
    let actualCostOfGoods = [];

    firstStocktakeDetailedReport.forEach((ingredient) => {
      let filterIngById = this._getFilteredItem(secondStocktakeDetailedReport, '_id', ingredient._id);
      if (filterIngById.length) {
        let filterIngByOrders = this._getFilteredItem(this._getStocktakesOrdersReceived(), 'stockId', ingredient._id);
        let ordersReceived = filterIngByOrders.length ? filterIngByOrders[0].price : 0;
        actualCostOfGoods.push({
          _id: ingredient._id,
          ordersReceived: `$ ${ordersReceived}`,
          description: ingredient.description,
          actualCost: HospoHero.misc.rounding(ordersReceived + (ingredient.stockTotalValue - filterIngById[0].stockTotalValue))
        });
      }
    });

    return actualCostOfGoods;
  }

  _getStocktakeDetailedReport(stocktakeGroup, areaId) {
    let currentStocktakeReport = new StocktakeTotalDetailedReport(stocktakeGroup, areaId, {});
    return currentStocktakeReport.getIngredientsOfCurrentStocktake();
  }

  /**
   *  received Orders for two Stocktakes
   */

  _getStocktakesOrdersReceived() {
    let stocktakesOrders = new OrdersReporter(this._fromDate, this._toDate, this._areaId);
    return stocktakesOrders.getDetailedOrdersReceived();
  }
}
;