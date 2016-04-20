const canUserEditStocks = function (areaId = null) {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit stocks');
};

const areaNameChecker = HospoHero.checkers.forNonEmptyString('area name');

const stockAreaItemType = Match.OneOf('prep', 'stock');

const canEditStockAreaAndItem = function (itemId, specialAreaId, isStock, errorMsg) {
  let targetCollection = isStock ? Ingredients : JobItems;

  let specialArea = StockAreas.findOne({_id: specialAreaId});
  let targetAreaId = specialArea && specialArea.relations.areaId;

  let itemDocument = targetAreaId && targetCollection.findOne({_id: itemId, 'relations.areaId': targetAreaId});
  if (!specialArea || !itemDocument || !canUserEditStocks(targetAreaId)) {
    logger.error(errorMsg);
    throw new Meteor.Error(403, errorMsg);
  }
};


Meteor.methods({
  createGeneralArea: function (name) {
    check(name, areaNameChecker);

    if (!canUserEditStocks()) {
      logger.error('User not permitted to create general Areas');
      throw new Meteor.Error(403, 'User not permitted to create general Areas');
    }

    let relationsObject = HospoHero.getRelationsObject();
    var existingStockArea = StockAreas.findOne({
      generalAreaId: {$exists: false},
      name: name.trim(),
      'relations.areaId': relationsObject.areaId
    });

    if (existingStockArea) {
      logger.error('General area name should be unique', existingStockArea);
      throw new Meteor.Error('General area name should be unique');
    }

    var newStockAreaId = StockAreas.insert({
      name: name,
      createdAt: Date.now(),
      relations: relationsObject
    });

    logger.info('New General area created', newStockAreaId);
    return newStockAreaId;
  },

  createSpecialArea: function (name, generalAreaId) {
    check(name, areaNameChecker);
    check(generalAreaId, HospoHero.checkers.MongoId);

    let generalArea = StockAreas.findOne({_id: generalAreaId});

    if (!generalArea || !canUserEditStocks(generalArea.relations.areaId)) {
      logger.error('User not permitted to create special areas');
      throw new Meteor.Error(403, 'User not permitted to create special areas');
    }

    let relationsObject = HospoHero.getRelationsObject();
    var existingSpecialArea = StockAreas.findOne({
      generalAreaId: {$exists: true},
      name: name.trim(),
      ingredientsIds: [],
      'relations.areaId': relationsObject.areaId
    });

    if (existingSpecialArea) {
      logger.error('Special area name should be unique');
      throw new Meteor.Error('Special area name should be unique');
    }

    var newSpecialAreaId = StockAreas.insert({
      name: name,
      generalAreaId: generalAreaId,
      createdAt: Date.now(),
      ingredients: [],
      relations: relationsObject
    });

    logger.info("New Special area created", newSpecialAreaId);
    return newSpecialAreaId;
  },

  renameStockArea: function (stockAreaId, newName) {
    check(stockAreaId, HospoHero.checkers.MongoId);
    check(newName, areaNameChecker);

    var stockArea = StockAreas.findOne({_id: stockAreaId});

    if (!stockArea || !canUserEditStocks(stockArea.relations.areaId)) {
      logger.error('User not permitted to edit general areas');
      throw new Meteor.Error(403, 'User not permitted to edit general areas');
    }

    if (newName !== stockArea.name) {
      StockAreas.update({_id: stockAreaId}, {$set: {name: newName}});
    }
  },

  removeStockArea: function (stockAreaId) {
    check(stockAreaId, HospoHero.checkers.MongoId);

    var stockArea = StockAreas.findOne({_id: stockAreaId});

    if (!stockArea || !canUserEditStocks(stockArea.relations.areaId)) {
      logger.error('User not permitted to delete general areas');
      throw new Meteor.Error(403, 'User not permitted to delete general areas');
    }

    if (!stockArea.generalAreaId) { //is general area
      let relatedStockAreasIds = StockAreas.find({
        generalAreaId: stockAreaId
      }).map(specialArea => specialArea._id);

      relatedStockAreasIds.push(stockAreaId);

      //remove general area and all related special areas
      StockAreas.remove({_id: {$in: relatedStockAreasIds}});
    } else {
      //remove special area
      StockAreas.remove({_id: stockAreaId});
    }
    logger.info("Stock area removed", stockAreaId);
  },

  assignItemToStockArea: function (itemId, specialAreaId, itemType) {
    check(itemId, HospoHero.checkers.MongoId);
    check(specialAreaId, HospoHero.checkers.MongoId);
    check(itemType, stockAreaItemType);

    let isStock = itemType === 'stock';
    canEditStockAreaAndItem(itemId, specialAreaId, isStock, 'User not permitted to assign items to stock areas');

    StockAreas.update({_id: specialAreaId}, {
      $addToSet: {
        [isStock ? 'ingredientsIds' : 'prepItemIds']: itemId
      }
    });

    logger.info('Item added to stock area', {itemId, specialAreaId, itemType});
  },

  removeItemFromStockArea: function (itemId, specialAreaId, itemType) {
    check(itemId, HospoHero.checkers.MongoId);
    check(specialAreaId, HospoHero.checkers.MongoId);
    check(itemType, stockAreaItemType);

    let isStock = itemType === 'stock';
    canEditStockAreaAndItem(itemId, specialAreaId, isStock, 'User not permitted to remove items from stock areas');

    StockAreas.update({_id: specialAreaId}, {
      $pull: {
        [isStock ? 'ingredientsIds' : 'prepItemIds']: itemId
      }
    });

    //remove related stock / stock-prep item as well
    let targetCollection = isStock ? StockItems : StockPrepItems;
    targetCollection.remove({
      specialAreaId: specialAreaId,
      [isStock ? 'ingredient.id' : 'jobItemId']: itemId
    });

    logger.info('Item removed from stock area', {itemId, specialAreaId, itemType});
  },

  updateStockAreaIngredientsOrder: function (specialAreaId, ingredientsIds) {
    check(specialAreaId, HospoHero.checkers.MongoId);
    check(ingredientsIds, [HospoHero.checkers.MongoId]);

    let specialArea = StockAreas.findOne({_id: specialAreaId, generalAreaId: {$exists: true}});
    if (!specialArea || !canUserEditStocks(specialArea.relations.areaId)) {
      logger.error('User not permitted to assign stock to areas');
      throw new Meteor.Error(403, 'User not permitted to assign stock to areas');
    }

    StockAreas.update({_id: specialAreaId}, {$set: {ingredientsIds: ingredientsIds}});
  }
});