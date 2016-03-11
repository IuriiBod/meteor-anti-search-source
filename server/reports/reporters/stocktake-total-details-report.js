StocktakeTotalDetailedReport = class {
  constructor(stocktakeGroup, areaId, searchingParams) {
    this._stocktakeGroup = stocktakeGroup;
    this._supplierId = searchingParams.supplierId;
    this._searchText = searchingParams.searchText;
    this._areaId = areaId;

    this._getAllIngredients();
  }

  _query() {
    let query = {
      'relations.areaId': this._areaId
    };
    if (this._supplierId) {
      query.suppliers = this._supplierId;
    }
    if (this._searchText) {
      query.description = {$regex: `${this._searchText}`, $options: 'i'};
    }

    return query;
  }

  _options() {
    return {
      fields: {
        _id: 1,
        description: 1
      }
    };
  }

  _getAllIngredients() {
    this._ingredientsList = Ingredients.find(this._query(), this._options()).fetch();
  }

  _filterIngredient(stockId) {
    return _.filter(this._ingredientsList, (ingredient) => ingredient._id === stockId);
  }

  getIngredientsOfCurrentStocktake() {
    let ingredientsList = [];
    this._stocktakeGroup.forEach((stock) => {
      let filteredIng = this._filterIngredient(stock.stockId);
      if (filteredIng.length) {
        let ingredient = {
          _id: stock.stockId,
          description: filteredIng[0].description,
          qty: stock.counting,
          purchasePrice: `${stock.unitCost} / ${stock.unit}`,
          stockTotalValue: HospoHero.misc.rounding(stock.counting * stock.unitCost, 100)
        };

        ingredientsList.push(ingredient);
      }
    });

    return ingredientsList;
  }
};