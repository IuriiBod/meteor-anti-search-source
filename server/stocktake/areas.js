Meteor.methods({
  'createGeneralArea': function(name) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to create general Areas");
      throw new Meteor.Error(404, "User not permitted to create general Areas");
    }

    check(name, String);

    var exist = GeneralAreas.findOne({"name": name});
    if(exist) {
      logger.error('General area name should be unique', exist);
      throw new Meteor.Error(404, "General area name should be unique");
    }
    logger.info("New General area created");
    return GeneralAreas.insert({
      "name": name,
      "specialAreas": [],
      "createdAt": Date.now(),
      "active": true,
      relations: HospoHero.getRelationsObject()
    });
  },

  'editGeneralArea': function(id, newName) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to edit general Areas");
      throw new Meteor.Error(404, "User not permitted to edit general Areas");
    }

    HospoHero.checkMongoId(id);
    check(newName, String);

    var exist = GeneralAreas.findOne(id);
    if(!exist) {
      logger.error('General area does not exist', id);
      throw new Meteor.Error(404, "General area does not exist");
    }

    if(newName) {
      GeneralAreas.update({"_id": id}, {$set: {name: newName}});
      logger.info("General area updated", id);
    }
  },

  deleteGeneralArea: function(id) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to delete general Areas");
      throw new Meteor.Error(404, "User not permitted to delete general Areas");
    }

    HospoHero.checkMongoId(id);

    var generalArea = GeneralAreas.findOne(id);
    if(!generalArea) {
      logger.error("General area does not exist");
      throw new Meteor.Error(404, "General area does not exist");
    }
    if(generalArea.specialAreas && generalArea.specialAreas.length > 0) {
      logger.error("Existing special areas. Can't delete. Archiving..", id);
      GeneralAreas.update({"_id": id}, {$set: {"active": false}})
    } else {
      GeneralAreas.remove({"_id": id});
      logger.error("General area removed", id);
    }
  },

  'createSpecialArea': function(name, gareaId) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to create special Areas");
      throw new Meteor.Error(404, "User not permitted to create special Areas");
    }

    check(name, String);
    HospoHero.checkMongoId(gareaId);

    if(!name) {
      logger.error("Special area should have a name");
      throw new Meteor.Error(404, "Special area should have a name");
    }

    var gAreaExist = GeneralAreas.findOne(gareaId);
    if(!gAreaExist) {
      logger.error('General area does not exist', gareaId);
      throw new Meteor.Error(404, "General area does not exist");
    }
    var exist = SpecialAreas.findOne({"name": name});
    if(exist) {
      logger.error('Special area name should be unique', exist);
      throw new Meteor.Error(404, "Special area name should be unique");
    }
    var id = SpecialAreas.insert({
      "name": name,
      "generalArea": gareaId,
      "createdAt": Date.now(),
      "stocks": [],
      "active": true,
      relations: HospoHero.getRelationsObject()
    });
    GeneralAreas.update({"_id": gareaId}, {$addToSet: {"specialAreas": id}});
    logger.info("New Special area created", id);
    return id;
  },

  'editSpecialArea': function(id, newName) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to special special Areas");
      throw new Meteor.Error(404, "User not permitted to special special Areas");
    }

    HospoHero.checkMongoId(id);
    check(newName, String);

    var exist = SpecialAreas.findOne(id);
    if(!exist) {
      logger.error('Special area does not exist', id);
      throw new Meteor.Error(404, "Special area does not exist");
    }
    if(newName) {
      SpecialAreas.update({"_id": id}, {$set: {name: newName}});
      logger.info("Special area updated", id);
    }
  },

  assignStocksToAreas: function(stockId, sareaId) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to assign stocks to Areas");
      throw new Meteor.Error(404, "User not permitted to assign stocks to Areas");
    }

    HospoHero.checkMongoId(stockId);
    HospoHero.checkMongoId(sareaId);

    var stock = Ingredients.findOne(stockId);
    if(!stock) {
      logger.error('Stock item does not exist', stockId);
      throw new Meteor.Error(404, "Stock item does not exist");
    }
    var sAreaExist = SpecialAreas.findOne(sareaId);
    if(!sAreaExist) {
      logger.error('Special area does not exist', sareaId);
      throw new Meteor.Error(404, "Special area does not exist");
    }
    var gAreaExist = GeneralAreas.findOne(sAreaExist.generalArea);
    if(!gAreaExist) {
      logger.error('General area does not exist', gareaId);
      throw new Meteor.Error(404, "General area does not exist");
    }
    SpecialAreas.update({"_id": sareaId}, {$addToSet: {"stocks": stockId}});
    Ingredients.update({"_id": stockId}, {$addToSet: {"specialAreas": sareaId, "generalAreas": sAreaExist.generalArea}});
    logger.info('Stock item added to area', {"stock": stockId, "sarea": sareaId});
  },
  
  removeStocksFromAreas: function(stockId, sareaId) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to remove stocks from Areas");
      throw new Meteor.Error(404, "User not permitted to remove stocks from Areas");
    }

    HospoHero.checkMongoId(stockId);
    HospoHero.checkMongoId(sareaId);

    var stock = Ingredients.findOne(stockId);
    if(!stock) {
      logger.error('Stock item does not exist', stockId);
      throw new Meteor.Error(404, "Stock item does not exist");
    }
    var sAreaExist = SpecialAreas.findOne(sareaId);
    if(!sAreaExist) {
      logger.error('Special area does not exist', sareaId);
      throw new Meteor.Error(404, "Special area does not exist");
    }
    var gAreaExist = GeneralAreas.findOne(sAreaExist.generalArea);
    if(!gAreaExist) {
      logger.error('General area does not exist', gareaId);
      throw new Meteor.Error(404, "General area does not exist");
    }
    if(sAreaExist.stocks.indexOf(stockId) < 0) {
      logger.error('Stock item not in special area', stockId);
      throw new Meteor.Error(404, "Stock item not in special area");
    }
    SpecialAreas.update({"_id": sareaId}, {$pull: {"stocks": stockId}});
    Ingredients.update({"_id": stockId}, {
      $pull: {
        "specialAreas": sareaId,
        "generalAreas": sAreaExist.generalArea
      }
    });
    logger.info('Stock item removed from area', {"stock": stockId, "sarea": sareaId});
  },

  deleteSpecialArea: function(id) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to delete special areas");
      throw new Meteor.Error(404, "User not permitted to delete special areas");
    }

    HospoHero.checkMongoId(id);

    var specialArea = SpecialAreas.findOne(id);
    if(!specialArea) {
      logger.error("Special area does not exist");
      throw new Meteor.Error(404, "Special area does not exist");
    }
    if(specialArea.stocks && specialArea.stocks.length > 0) {
      logger.error("Existing stocks. Can't delete. Archiving..", id);
      SpecialAreas.update({"_id": id}, {$set: {"active": false}})
    } else {
      SpecialAreas.remove({"_id": id});
      GeneralAreas.update({"_id": specialArea.generalArea}, {$pull: {"specialAreas": id}});
      logger.error("Special area removed", id);
    }
  }
});