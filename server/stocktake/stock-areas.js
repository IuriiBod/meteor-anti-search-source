var canUserEditStocks = function (areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit stocks');
};

let areaNameChecker = HospoHero.checkers.forNonEmptyString('area name');

Meteor.methods({
  createGeneralArea: function (name) {
    check(name, areaNameChecker);

    if (!canUserEditStocks()) {
      logger.error("User not permitted to create general Areas");
      throw new Meteor.Error(403, "User not permitted to create general Areas");
    }

    let relationsObject = HospoHero.getRelationsObject();
    var existingStockArea = StockAreas.findOne({
      generalAreaId: {$exists: false},
      name: name,
      'relations.areaId': relationsObject.areaId
    });

    if (existingStockArea) {
      logger.error('General area name should be unique', existingStockArea);
      throw new Meteor.Error("General area name should be unique");
    }

    var newStockAreaId = StockAreas.insert({
      name: name,
      createdAt: Date.now(),
      active: true,
      relations: relationsObject
    });

    logger.info("New General area created", newStockAreaId);
    return newStockAreaId;
  },

  renameStockArea: function (stockAreaId, newName) {
    check(stockAreaId, HospoHero.checkers.MongoId);
    check(newName, areaNameChecker);

    var stockArea = StockAreas.findOne({_id: stockAreaId});

    if (!stockArea || !canUserEditStocks(stockArea.relations.areaId)) {
      logger.error("User not permitted to edit general areas");
      throw new Meteor.Error(403, "User not permitted to edit general areas");
    }

    if (newName !== stockArea.name) {
      StockAreas.update({_id: stockAreaId}, {$set: {name: newName}});
    }
  },

  deleteGeneralArea: function (generalAreaId) {
    check(generalAreaId, HospoHero.checkers.MongoId);

    var generalArea = StockAreas.findOne({_id: generalAreaId});

    if (!generalArea || !canUserEditStocks(generalArea.relations.areaId)) {
      logger.error("User not permitted to delete general areas");
      throw new Meteor.Error(403, "User not permitted to delete general areas");
    }

    if (generalArea.specialAreas && generalArea.specialAreas.length > 0) {
      logger.info("Existing special areas. Can't delete. Archiving..", generalAreaId);
      StockAreas.update({_id: generalAreaId}, {$set: {active: false}});
    } else {
      StockAreas.remove({_id: generalAreaId});
      logger.info("General area removed", generalAreaId);
    }
  },

  createSpecialArea: function (name, generalAreaId) {
    check(name, areaNameChecker);
    check(generalAreaId, HospoHero.checkers.MongoId);

    let generalArea = StockAreas.findOne({_id: generalAreaId});

    if (!generalArea || !canUserEditStocks(generalArea.relations.areaId)) {
      logger.error("User not permitted to create special areas");
      throw new Meteor.Error(403, "User not permitted to create special areas");
    }

    let relationsObject = HospoHero.getRelationsObject();
    var existingSpecialArea = StockAreas.findOne({
      generalAreaId: {$exists: true},
      name: name,
      ingredientsIds: [],
      'relations.areaId': relationsObject.areaId
    });

    if (existingSpecialArea) {
      logger.error('Special area name should be unique');
      throw new Meteor.Error("Special area name should be unique");
    }

    var newSpecialAreaId = StockAreas.insert({
      name: name,
      generalAreaId: generalAreaId,
      createdAt: Date.now(),
      ingredients: [],
      active: true,
      relations: relationsObject
    });

    logger.info("New Special area created", newSpecialAreaId);
    return newSpecialAreaId;
  },

  assignIngredientToStockArea: function (ingredientId, specialAreaId) {
    check(ingredientId, HospoHero.checkers.MongoId);
    check(specialAreaId, HospoHero.checkers.MongoId);

    let specialArea = StockAreas.findOne({_id: specialAreaId});
    let ingredient = Ingredients.findOne({_id: ingredientId});
    if (!ingredient || !specialArea || !canUserEditStocks(specialArea.relations.areaId)) {
      logger.error("User not permitted to assign stock to areas");
      throw new Meteor.Error(403, "User not permitted to assign stock to areas");
    }

    StockAreas.update({_id: specialAreaId}, {$addToSet: {ingredientsIds: ingredientId}});
    logger.info('Stock item added to area', {stock: ingredientId, sarea: specialAreaId});
  },

  updateStockAreaIngredientsOrder: function (specialAreaId, ingredientsIds) {
    check(specialAreaId, HospoHero.checkers.MongoId);
    check(ingredientsIds, [HospoHero.checkers.MongoId]);

    let specialArea = StockAreas.findOne({_id: specialAreaId, generalAreaId: {$exists: true}});
    if (!specialArea || !canUserEditStocks(specialArea.relations.areaId)) {
      logger.error("User not permitted to assign stock to areas");
      throw new Meteor.Error(403, "User not permitted to assign stock to areas");
    }

    StockAreas.update({_id: specialAreaId}, {$set: {ingredientsIds: ingredientsIds}});
  },

  removeIngredientFromStockArea: function (ingredientId, specialAreaId) {
    check(ingredientId, HospoHero.checkers.MongoId);
    check(specialAreaId, HospoHero.checkers.MongoId);

    var specialArea = StockAreas.findOne({_id: specialAreaId});
    let ingredient = Ingredients.findOne({_id: ingredientId});
    if (!specialArea || !ingredient || !canUserEditStocks(specialArea.relations.areaId)) {
      logger.error("User not permitted to remove stocks from areas");
      throw new Meteor.Error(404, "User not permitted to remove stocks from areas");
    }

    StockAreas.update({_id: specialAreaId}, {$pull: {ingredientsIds: ingredientId}});
    logger.info('Stock item removed from area', {stock: ingredientId, specialArea: specialAreaId});
  },

  deleteSpecialArea: function (specialAreaId) {
    check(specialAreaId, HospoHero.checkers.MongoId);

    var specialArea = StockAreas.findOne({_id: specialAreaId});
    if (!specialArea || !canUserEditStocks(specialArea.relations.areaId)) {
      logger.error("User not permitted to delete general areas");
      throw new Meteor.Error(403, "User not permitted to delete general areas");
    }

    if (specialArea.stocks && specialArea.stocks.length > 0) {
      logger.error("Existing stocks. Can't delete. Archiving..", specialAreaId);
      StockAreas.update({_id: specialAreaId}, {$set: {active: false}});
    } else {
      StockAreas.remove({_id: specialAreaId});
      logger.error("Special area removed", specialAreaId);
    }
  }
});