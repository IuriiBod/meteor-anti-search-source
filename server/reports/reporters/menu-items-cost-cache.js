class MenuItemsCostCache {
  /**
   * @param {string} areaId
   */
  constructor(areaId) {
    this._areaId = areaId;
    this._initCache();
  }

  _initCache() {
    this._cache = MenuItems.find({'relations.areaId': this._areaId}, {
      fields: {
        ingredients: 1,
        jobItems: 1,
        salesPrice: 1
      }
    }).map((menuItem)=> {
      let menuItemAnalysis = HospoHero.analyze.menuItem(menuItem);
      return {
        menuItemId: menuItem._id,
        totalIngredientCost: menuItemAnalysis.ingCost,
        totalPreparationCost: menuItemAnalysis.prepCost,
        salePrice: menuItemAnalysis.salesPrice
      };
    });
  }

  lookup(menuItemId) {
    return _.findWhere(this._cache, {menuItemId});
  }
}

Namespace('HospoHero.reporting', {
  MenuItemsCostCache: MenuItemsCostCache
});