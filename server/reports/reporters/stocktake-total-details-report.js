class StocktakeTotalReport {
  constructor(stockItems, supplierId, searchText, areaId) {
    this._stockItems = stockItems;
    this._supplierId = supplierId;
    this._searchText = searchText;
    this._areaId = areaId;

    this._getAllIngredients();
  }

  _getAllIngredients() {
    let query = {
      'relations.areaId': this._areaId
    };

    if (this._supplierId) {
      query.suppliers = this._supplierId;
    }
    if (this._searchText) {
      query.description = {$regex: `${this._searchText}`, $options: 'i'};
    }

    let options = {
      fields: {
        _id: 1,
        description: 1,
        portionOrdered: 1
      }
    };

    this._ingredientsList = Ingredients.find(query, options).fetch();
  }

  _filterIngredient(stockId) {
    return _.filter(this._ingredientsList, (ingredient) => ingredient._id === stockId);
  }

  getIngredientsOfCurrentStocktake() {
    let ingredientsList = [];
    this._stockItems.forEach((item) => {
      let filteredIng = this._filterIngredient(item.ingredient.id);
      if (filteredIng.length) {
        let ingredient = {
          _id: item.ingredient.id,
          description: filteredIng[0].description,
          qty: item.count,
          purchasePrice: `${item.ingredient.cost} / ${filteredIng[0].portionOrdered}`,
          stockTotalValue: HospoHero.misc.rounding(item.count * item.ingredient.cost, 100)
        };

        ingredientsList.push(ingredient);
      }
    });

    return ingredientsList;
  }
}


Namespace('HospoHero.reporting', {
  StocktakeTotalReport: StocktakeTotalReport
});