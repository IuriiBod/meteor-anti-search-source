Meteor.methods({
  'createGeneralArea': function(name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to create general Areas");
      throw new Meteor.Error(404, "User not permitted to create general Areas");
    }
    if(!name) {
      logger.error("General area should have a name");
      throw new Meteor.Error(404, "General area should have a name");
    }
    var exist = GeneralAreas.findOne({"name": name});
    if(exist) {
      logger.error('General area name should be unique', exist);
      throw new Meteor.Error(404, "General area name should be unique");
    }
    var id = GeneralAreas.insert({"name": name, "specialAreas": [], "createdAt": Date.now()});
    logger.info("New General area created", id);
    return id;
  },

  'editGeneralArea': function(id, info) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to edit general areas");
      throw new Meteor.Error(404, "User not permitted to edit general areas");
    }
    if(!id) {
      logger.error("General area should have a id");
      throw new Meteor.Error(404, "General area should have a id");
    }
    var exist = GeneralAreas.findOne(id);
    if(!exist) {
      logger.error('General area does not exist', id);
      throw new Meteor.Error(404, "General area does not exist");
    }
    var updateDoc = {};
    if(info.name != exist.name) {
      updateDoc.name = info.name;
    }
    if(Object.keys(updateDoc).length > 0) {
      GeneralAreas.update({"_id": id}, {$set: updateDoc});
      logger.info("General area updated", id);
      return;
    }
  },

  deleteGeneralArea: function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to delete general areas");
      throw new Meteor.Error(404, "User not permitted to delete general areas");
    }
    if(!id) {
      logger.error("Id should have a value");
      throw new Meteor.Error(404, "Id should have a value");
    }
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
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to create special areas");
      throw new Meteor.Error(404, "User not permitted to create special areas");
    }
    if(!name) {
      logger.error("Special area should have a name");
      throw new Meteor.Error(404, "Special area should have a name");
    }
    if(!gareaId) {
      logger.error("General area id not found");
      throw new Meteor.Error(404, "General area id not found");
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
    var id = SpecialAreas.insert({"name": name, "generalArea": gareaId, "createdAt": Date.now(), "stocks": []});
    GeneralAreas.update({"_id": gareaId}, {$addToSet: {"specialAreas": id}});
    logger.info("New Special area created", id);
    return id;
  },

  'editSpecialArea': function(id, info) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to edit special areas");
      throw new Meteor.Error(404, "User not permitted to edit special areas");
    }
    if(!id) {
      logger.error("Special area should have a id");
      throw new Meteor.Error(404, "Special area should have a id");
    }
    var exist = SpecialAreas.findOne(id);
    if(!exist) {
      logger.error('Special area does not exist', id);
      throw new Meteor.Error(404, "Special area does not exist");
    }
    var updateDoc = {};
    if(info.name != exist.name) {
      updateDoc.name = info.name;
    }
    if(Object.keys(updateDoc).length > 0) {
      SpecialAreas.update({"_id": id}, {$set: updateDoc});
      logger.info("Special area updated", id);
      return;
    }
  },

  assignStocksToAreas: function(stockId, sareaId) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to assign stock to areas");
      throw new Meteor.Error(404, "User not permitted to assign stock to areas");
    }
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
    Ingredients.update({"_id": stockId}, {$addToSet: {"specialAreas": sareaId, "generalAreas": sAreaExist.generalArea}})
    logger.info('Stock item added to area', {"stock": stockId, "sarea": sareaId});
    return;
  },
  
  removeStocksFromAreas: function(stockId, sareaId) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to remove stocks from areas");
      throw new Meteor.Error(404, "User not permitted to remove stocks from areas");
    }
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
    Ingredients.update({"_id": stockId}, {$pull: {"specialAreas": sareaId, "generalAreas": sAreaExist.generalArea}})
    logger.info('Stock item removed from area', {"stock": stockId, "sarea": sareaId});
    return;
  },

  deleteSpecialArea: function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to delete special areas");
      throw new Meteor.Error(404, "User not permitted to delete special areas");
    }
    if(!id) {
      logger.error("Id should have a value");
      throw new Meteor.Error(404, "Id should have a value");
    }
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
  },
});