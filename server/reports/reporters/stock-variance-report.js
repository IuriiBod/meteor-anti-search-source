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

  _getTotalExpectedCostOfIngredient() {
    let stocks = this._expectedIngredientCostOfMenuItems();
    let stocksIds = _.uniq(_.pluck(stocks, '_id'));

    return _.compact(stocksIds.map((stockId) => {
      let ingredientTotalExpectedCost = _.filter(stocks, (stock) => stockId === stock._id)
          .reduce((memo, stock) => memo + stock.ingExpectedCost, 0);
      let stockFromCache = this._ingredientsCache.searchByIngredientId(stockId);
      if (stockFromCache) {
        return {
          stockId: stockFromCache.description,
          totalExpectedCost: ingredientTotalExpectedCost
        }
      }
    }));
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
};