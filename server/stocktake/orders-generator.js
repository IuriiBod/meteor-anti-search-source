class StockOrdersGenerator {
  constructor(stocktake) {
    this._stocktake = stocktake;
  }

  generate() {
    this._checkIfStocktakeCompleted();

    let stockItemInStocktake = StockItems.findOne({stocktakeId: this._stocktake._id});
    if (!stockItemInStocktake) {
      throw new Meteor.Error(500, 'Cannot generate orders: there is no stocks inside this stocktake');
    }

    let suppliersIngredientsMap = this._getRelatedSuppliersIngredientsMap();
    let relationsObject = this._stocktake.relations;

    //generate orders itself (order per supplier)
    _.each(suppliersIngredientsMap, (ingredientEntries, supplierId) => {
      let orderId = Orders.insert({
        stocktakeId: this._stocktake._id,
        supplierId: supplierId,
        placedBy: Meteor.userId(),
        createdAt: new Date(),
        relations: relationsObject
      });

      //generate order item per ingredient
      ingredientEntries.forEach((ingredientEntry) => {
        OrderItems.insert({
          orderId: orderId,
          orderedCount: 0,
          ingredient: ingredientEntry,
          relations: relationsObject
        });
      });
    });
  }

  /**
   * Checks if all ingredients are counted
   */
  _checkIfStocktakeCompleted() {
    let specialAreas = StockAreas.find({
      generalAreaId: {$exists: true},
      'relations.areaId': this._stocktake.relations.areaId
    });

    let requiredIngsObj = {};

    specialAreas.forEach(specialArea => {
      if (_.isArray(specialArea.ingredientsIds)) {
        specialArea.ingredientsIds.forEach(ingredientId => requiredIngsObj[ingredientId] = true);
      }
    });

    let requiredIngsArray = Object.keys(requiredIngsObj);

    let existingStockItems = StockItems.find({
      stocktakeId: this._stocktake._id
    }).map(stockItem => stockItem.ingredient.id);

    let missingIngredientsIds = _.difference(requiredIngsArray, existingStockItems);

    if (missingIngredientsIds.length > 0) {
      let errorMessage = this._generateErrorMessageAboutMissingIngredients(missingIngredientsIds);
      throw new Meteor.Error(500, errorMessage);
    } else {
      return true;
    }
  }

  /**
   * List first 10 missing ingredients names
   * Warning: method modifies missingIngredientsIds array
   *
   * @param missingIngredientsIds
   * @returns {string}
   * @private
   */
  _generateErrorMessageAboutMissingIngredients(missingIngredientsIds) {
    let missingIngsToDisplay = missingIngredientsIds.splice(0, 10);

    let missingIngredientsNames = Ingredients.find({
      _id: {$in: missingIngsToDisplay}
    }, {
      fields: {
        description: 1
      }
    }).map(ingredient => ingredient.description);

    let moreMessage = missingIngredientsIds.length > 0 ? `and ${missingIngredientsIds.length} more` : '';
    return `Cannot generate orders: You should specify count of ${missingIngredientsNames.join(', ')} ${moreMessage} ingredients`;
  }

  /**
   * Helps link suppliers and appropriate ingredients
   *
   * @returns {supplierId: [{id: String,cost: number}]} object where keys are suppliers ids and values are
   * array of related ingredients
   * @private
   */
  _getRelatedSuppliersIngredientsMap() {
    const suppliersMap = {};

    let addSupplierAndIngredientToMap = (supplierId, ingredientId, ingredientCost) => {
      if (!suppliersMap[supplierId]) {
        suppliersMap[supplierId] = [];
      }

      suppliersMap[supplierId].push({
        id: ingredientId,
        cost: ingredientCost
      });
    };

    //get all suppliers we need to order
    let ingredientsArrays = StockAreas.find({
      generalAreaId: {$exists: true},
      'relations.areaId': this._stocktake.relations.areaId
    }).map(stockArea => stockArea.ingredientsIds);

    let ingredientsIds = StockOrdersGenerator._arrayFlattenAndUnique(ingredientsArrays);

    let relatedIngredientsCursor = Ingredients.find({_id: {$in: ingredientsIds}}, {
      fields: {
        suppliers: 1,
        costPerPortion: 1
      }
    });

    relatedIngredientsCursor.forEach((ingredient) => {
      addSupplierAndIngredientToMap(ingredient.suppliers, ingredient._id, ingredient.costPerPortion);
    });

    return suppliersMap;
  }

  static _arrayFlattenAndUnique(array) {
    return _.unique(_.flatten(array));
  }
}

Namespace('HospoHero.stocktake', {
  OrdersGenerator: StockOrdersGenerator
});