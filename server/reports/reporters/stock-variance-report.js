StockVarianceReport = class {
  constructor(areaId, firstStocktakeGroup, secondStocktakeGroup, supplierId, searchText) {
    this._areaId = areaId;
    this._firstStocktakeGroup = firstStocktakeGroup;
    this._secondStocktakeGroup = secondStocktakeGroup;
    this._supplierId = supplierId;
    this._searchText = searchText;

    this._cacheMenuItems();
    this._setDates();
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

  _getStocktakesIngredients() {
    let firstStocktakeDetails = this._getStocktakeDetailedReport(this._firstStocktakeGroup, this._areaId);
    let secondStocktakeDetails = this._getStocktakeDetailedReport(this._secondStocktakeGroup, this._areaId);
    let stocktakesIngredients = [];

    firstStocktakeDetails.forEach((ingredient) => {
      let filterIngById = _.filter(secondStocktakeDetails, (stock) => stock._id === ingredient._id);
      if (filterIngById.length) {
        stocktakesIngredients.push({
          _id: ingredient._id,
          costInFirstStocktake: ingredient.stockTotalValue,
          costInSecondStocktake: filterIngById[0].stockTotalValue,
          description: ingredient.description
        });
      }
    });

    return stocktakesIngredients;
  }

  getVarianceReport() {
    let ingredientsList = this._getStocktakesIngredients();
    let expectedCostOfEachIngredient = this._getTotalExpectedCostOfIngredient();
    let round = HospoHero.misc.rounding;

    return ingredientsList.map((ingredient) => {
      let getExpectedCost = _.filter(expectedCostOfEachIngredient, (stock) => stock.stockId === ingredient._id);
      let expectedCost = getExpectedCost.length ? getExpectedCost[0].expectedCost : 0;
      let ordersReceived = this._getOrderReceived(ingredient._id);
      let actualCost = ordersReceived +
        (ingredient.costInFirstStocktake - ingredient.costInSecondStocktake); // calculations for actual cost for each ingredient

      return _.extend(ingredient, {
        ordersReceived: ordersReceived,
        expectedCost: round(expectedCost),
        actualCost: round(actualCost),
        variance: round(expectedCost - actualCost)
      });
    });
  }

  /**
   * Calculations for Expected Cost Of Ingredients
   */

  _getTotalExpectedCostOfIngredient() {
    let stocks = this._expectedIngredientCostOfMenuItems();
    let stocksIds = _.uniq(_.pluck(stocks, '_id'));

    return stocksIds.map((stockId) => {
      let ingredientTotalExpectedCost = _.filter(stocks, (stock) => stock._id === stockId)
        .reduce((memo, stock) => memo + stock.ingExpectedCost, 0);

      return {
        stockId: stockId,
        expectedCost: ingredientTotalExpectedCost
      };
    });
  }

  _expectedIngredientCostOfMenuItems() {
    let menuItemSales = this._getForecastedMenuItemsSales();
    let stockItems = [];
    menuItemSales.forEach((menuItem) => {
      let menuItems = this._getMenuItemsFromCache(menuItem.menuItemId);
      menuItems.ingredients.forEach((ingredient) => {
        if (ingredient._id) {
          let ingExpectedCost = menuItem.predictionQuantity * ingredient.quantity;
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

  _getStocktakeDetailedReport(stocktakeGroup, areaId) {
    let searchingParams = {
      supplierId: this._supplierId,
      searchText: this._searchText
    };
    let currentStocktakeReport = new StocktakeTotalDetailedReport(stocktakeGroup, areaId, searchingParams);
    return currentStocktakeReport.getIngredientsOfCurrentStocktake();
  }

  /**
   *  received Orders for two Stocktakes
   */

  _stocktakesOrdersReceivedReport() {
    let stocktakesOrders = new OrdersReporter(this._fromDate, this._toDate, this._areaId);
    return stocktakesOrders.getDetailedOrdersReceived();
  }

  _getOrderReceived(stockId) {
    let foundStock = _.findWhere(this._stocktakesOrdersReceivedReport(), {stockId});
    return foundStock && foundStock.price || 0;
  }
};