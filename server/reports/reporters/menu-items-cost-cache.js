MenuItemsCostCache = class {
  static _initCache() {
    let menuItemsIds = _.pluck(MenuItems.find({}, {fields: {_id: 1}}).fetch(), '_id');
    this._cache = _.map(menuItemsIds, (menuItemId) => {
      let menuItemAnalysis = HospoHero.analyze.menuItemById(menuItemId);
      return {
        menuItemId,
        totalIngredientCost: menuItemAnalysis.ingCost,
        totalPreparationCost: menuItemAnalysis.prepCost,
        salePrice: menuItemAnalysis.salesPrice
      }
    });
  }

  static lookup(menuItemId) {
    if (!this._cache) {
      this._initCache();
    }
    return _.findWhere(this._cache, {menuItemId});
  }
};