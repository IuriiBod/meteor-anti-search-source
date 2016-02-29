StocktakeTotalDetailedReport = class {
  constructor(stocktakeGroup, searchingParams) {
    this._stocktakeGroup = stocktakeGroup;
    this._supplierId = searchingParams.supplierId;
    this._searchText = searchingParams.searchText;

    this._getAllIngredients();
  }

  getReport() {
    return this._getIngsOfCurrentStocktake();
  }

  _query() {
    let query = {};
    if (this._supplierId) {
      query.suppliers = this._supplierId;
    }
    if (this._searchText) {
      query.description = {$regex: `${this._searchText}`, $options: 'i'};
    }

    return query;
  }

  _getAllIngredients() {
    this._ingredientsList = Ingredients.find(this._query()).fetch();
  }

  _getIngsOfCurrentStocktake() {
    let ingredientsList = [];

    this._stocktakeGroup.forEach((stock) => {
      let filteredIng = this._filterIngredient(stock.stockId);
      if (filteredIng.length) {
        let ingredient = {
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

  _filterIngredient(stockId) {
    return _.filter(this._ingredientsList, (ingredient) => ingredient._id === stockId);
  }
};