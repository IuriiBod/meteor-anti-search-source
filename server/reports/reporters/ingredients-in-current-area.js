IngredientsFromArea = class {
  constructor(areaId) {
    this._areaId = areaId;
    this._initCache();
  }

  _initCache() {
    this._cache = Ingredients.find({'relations.areaId': this._areaId}, {
      fields: {
        _id: 1,
        description: 1
      }
    }).fetch();
  }

  searchByIngredientId(ingredientId) {
    return _.findWhere(this._cache, {_id: ingredientId});
  }
};