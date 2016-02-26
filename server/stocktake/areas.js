var canUserEditStocks = function() {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(null, 'edit stocks');
};

Meteor.methods({
  createGeneralArea: function (name) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to create general Areas");
      throw new Meteor.Error(403, "User not permitted to create general Areas");
    }
    if (!name) {
      logger.error("General area should have a name");
      throw new Meteor.Error("General area should have a name");
    }
    var exist = GeneralAreas.findOne({
      "name": name,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });
    if (exist) {
      logger.error('General area name should be unique', exist);
      throw new Meteor.Error("General area name should be unique");
    }
    var id = GeneralAreas.insert({
      "name": name,
      "specialAreas": [],
      "createdAt": Date.now(),
      "active": true,
      relations: HospoHero.getRelationsObject()
    });
    logger.info("New General area created", id);
    return id;
  },

  editGeneralArea: function (id, newName) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to edit general areas");
      throw new Meteor.Error(403, "User not permitted to edit general areas");
    }

    check(id, HospoHero.checkers.MongoId);
    check(newName, String);

    if (!id) {
      logger.error("General area should have a id");
      throw new Meteor.Error("General area should have a id");
    }
    if (!newName) {
      logger.error("General area should have a name");
    }

    var exist = GeneralAreas.findOne(id);
    if (!exist) {
      logger.error('General area does not exist', id);
      throw new Meteor.Error("General area does not exist");
    }
    if (newName != exist.name) {
      GeneralAreas.update({"_id": id}, {$set: {name: newName}});
    }
  },

  deleteGeneralArea: function (id) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to delete general areas");
      throw new Meteor.Error(403, "User not permitted to delete general areas");
    }

    check(id, HospoHero.checkers.MongoId);
    if (!id) {
      logger.error("Id should have a value");
      throw new Meteor.Error("Id should have a value");
    }

    var generalArea = GeneralAreas.findOne(id);
    if (!generalArea) {
      logger.error("General area does not exist");
      throw new Meteor.Error("General area does not exist");
    }
    if (generalArea.specialAreas && generalArea.specialAreas.length > 0) {
      logger.error("Existing special areas. Can't delete. Archiving..", id);
      GeneralAreas.update({"_id": id}, {$set: {"active": false}})
    } else {
      GeneralAreas.remove({"_id": id});
      logger.error("General area removed", id);
    }
  },

  createSpecialArea: function (name, gareaId) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to create special areas");
      throw new Meteor.Error(403, "User not permitted to create special areas");
    }

    check(name, String);
    if (!name) {
      logger.error("Special area should have a name");
      throw new Meteor.Error("Special area should have a name");
    }

    check(gareaId, HospoHero.checkers.MongoId);
    if (!gareaId) {
      logger.error("General area id not found");
      throw new Meteor.Error("General area id not found");
    }

    if (!GeneralAreas.findOne(gareaId)) {
      logger.error('General area does not exist', gareaId);
      throw new Meteor.Error("General area does not exist");
    }

    var exist = SpecialAreas.findOne({
      "name": name,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });
    if (exist) {
      logger.error('Special area name should be unique');
      throw new Meteor.Error("Special area name should be unique");
    }

    var id = SpecialAreas.insert({
      "name": name,
      "generalArea": gareaId,
      "createdAt": Date.now(),
      "stocks": [],
      "active": true,
      relations: HospoHero.getRelationsObject()
    });

    GeneralAreas.update({
      "_id": gareaId
    }, {
      $addToSet: {
        "specialAreas": id
      }
    });

    logger.info("New Special area created", id);
    return id;
  },

  editSpecialArea: function (id, newName) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to edit special areas");
      throw new Meteor.Error(403, "User not permitted to edit special areas");
    }

    check(id, HospoHero.checkers.MongoId);
    if (!id) {
      logger.error("Special area should have a id");
      throw new Meteor.Error("Special area should have a id");
    }

    check(newName, String);
    if (!newName) {
      logger.error("Special area should have a name");
      throw new Meteor.Error("Special area should have a name");
    }

    var exist = SpecialAreas.findOne(id);
    if (!exist) {
      logger.error('Special area does not exist', id);
      throw new Meteor.Error("Special area does not exist");
    }

    if (newName != exist.name) {
      SpecialAreas.update({"_id": id}, {$set: {name: newName}});
    }
  },

  assignStocksToAreas: function (stockId, sareaId) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to assign stock to areas");
      throw new Meteor.Error(403, "User not permitted to assign stock to areas");
    }

    check(stockId, HospoHero.checkers.MongoId);
    check(sareaId, HospoHero.checkers.MongoId);

    if (!Ingredients.findOne(stockId)) {
      logger.error('Stock item does not exist', stockId);
      throw new Meteor.Error("Stock item does not exist");
    }

    var sAreaExist = SpecialAreas.findOne(sareaId);
    if (!sAreaExist) {
      logger.error('Special area does not exist', sareaId);
      throw new Meteor.Error("Special area does not exist");
    }
    if (!GeneralAreas.findOne(sAreaExist.generalArea)) {
      logger.error('General area does not exist');
      throw new Meteor.Error("General area does not exist");
    }
    SpecialAreas.update({"_id": sareaId}, {$addToSet: {"stocks": stockId}});
    Ingredients.update({"_id": stockId}, {$addToSet: {"specialAreas": sareaId, "generalAreas": sAreaExist.generalArea}})
    logger.info('Stock item added to area', {"stock": stockId, "sarea": sareaId});
  },

  removeStocksFromAreas: function (stockId, sareaId, stockRefId) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to remove stocks from areas");
      throw new Meteor.Error(404, "User not permitted to remove stocks from areas");
    }

    check(stockId, HospoHero.checkers.MongoId);
    check(sareaId, HospoHero.checkers.MongoId);

    if (!Ingredients.findOne(stockId)) {
      logger.error('Stock item does not exist', stockId);
      throw new Meteor.Error("Stock item does not exist");
    }
    var sAreaExist = SpecialAreas.findOne(sareaId);
    if (!sAreaExist) {
      logger.error('Special area does not exist', sareaId);
      throw new Meteor.Error("Special area does not exist");
    }
    if (!GeneralAreas.findOne(sAreaExist.generalArea)) {
      logger.error('General area does not exist');
      throw new Meteor.Error(404, "General area does not exist");
    }
    if (sAreaExist.stocks.indexOf(stockId) < 0) {
      logger.error('Stock item not in special area', stockId);
      throw new Meteor.Error(404, "Stock item not in special area");
    }
    SpecialAreas.update({"_id": sareaId}, {$pull: {"stocks": stockId}});
    Ingredients.update({"_id": stockId}, {$pull: {"specialAreas": sareaId, "generalAreas": sAreaExist.generalArea}})
    logger.info('Stock item removed from area', {"stock": stockId, "sarea": sareaId});

    if (stockRefId) {
      Meteor.call("removeStocktake", stockRefId);
    }
  },

  deleteSpecialArea: function (id) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to delete general areas");
      throw new Meteor.Error(403, "User not permitted to delete general areas");
    }

    check(id, HospoHero.checkers.MongoId);
    if (!id) {
      logger.error("Id should have a value");
      throw new Meteor.Error("Id should have a value");
    }

    var specialArea = SpecialAreas.findOne(id);
    if (!specialArea) {
      logger.error("Special area does not exist");
      throw new Meteor.Error(404, "Special area does not exist");
    }
    if (specialArea.stocks && specialArea.stocks.length > 0) {
      logger.error("Existing stocks. Can't delete. Archiving..", id);
      SpecialAreas.update({"_id": id}, {$set: {"active": false}})
    } else {
      SpecialAreas.remove({"_id": id});
      GeneralAreas.update({"_id": specialArea.generalArea}, {$pull: {"specialAreas": id}});
      logger.error("Special area removed", id);
    }
  }
});