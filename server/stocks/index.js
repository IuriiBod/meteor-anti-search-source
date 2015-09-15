Meteor.methods({
  createIngredients: function(info) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }
    if(!info.code) {
      logger.error("Code field not found");
      throw new Meteor.Error(404, "Code field not found");
    }
    if(!info.description) {
      logger.error("Description field not found");
      throw new Meteor.Error(404, "Description field not found");
    }
    var exist = Ingredients.findOne({"code": info.code});
    if(exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change code and try again");
    }
    if(!info.costPerPortion || (info.costPerPortion != info.costPerPortion)) {
      info.costPerPortion = 0;
    }
    if(!info.unitSize || (info.unitSize != info.unitSize)) {
      info.unitSize = 0;
    }
    if(!info.portionOrdered) {
      info.portionOrdered = null;
    }
    if(!info.portionUsed) {
      info.portionUsed = null;
    }
    var doc = {
      "code": info.code,
      "description": info.description,
      "suppliers": info.suppliers,
      "portionOrdered": info.portionOrdered,
      "costPerPortion": info.costPerPortion,
      "portionUsed": info.portionUsed,
      "unitSize": parseFloat(info.unitSize),
      "status": "active",
      "createdOn": Date.now(),
      "createdBy": user._id
    }
    var id = Ingredients.insert(doc);
    logger.info("New ingredient inserted ", id);
    return id;
  },

  editIngredient: function(id, info) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to edit ingredients");
      throw new Meteor.Error(403, "User not permitted to edit ingredients");
    }
    if(!id) {
      logger.error("Id field not found");
      throw new Meteor.Error(404, "Id field not found");
    }
    var item = Ingredients.findOne(id);
    if(!item) {
      logger.error("Item not found");
      throw new Meteor.Error(404, "Item not found");
    }
    if(Object.keys(info).length < 0) {
      logger.error("No editing fields found");
      throw new Meteor.Error(404, "No editing fields found");
    }
    var updateDoc = {};
    if(info.code) {
      if(item.code != info.code) {
        updateDoc.code = info.code;
      }
    }
    if(info.description) {
      if(item.description != info.description) {
        updateDoc.description = info.description;
      }
    }
    if(info.suppliers) {
      updateDoc.suppliers = info.suppliers;
    }
    if(info.portionOrdered) {
      if(item.portionOrdered != info.portionOrdered) {
        updateDoc.portionOrdered = info.portionOrdered;
      }
    }
    if(info.unitSize) {
      if(item.unitSize != info.unitSize) {
        updateDoc.unitSize = parseFloat(info.unitSize);
      }
    }
    if(info.costPerPortion) {
      if(info.costPerPortion == info.costPerPortion) {
        if(item.costPerPortion != info.costPerPortion) {
          updateDoc.costPerPortion = parseFloat(info.costPerPortion);
        }
      }
    }
    if(info.portionUsed) {
      if(item.portionUsed != info.portionUsed) {
        updateDoc.portionUsed = info.portionUsed;
      }
    }
    if(Object.keys(updateDoc).length > 0) {
      updateDoc['editedOn'] = Date.now();
      updateDoc['editedBy'] = user._id;
      Ingredients.update({'_id': id}, {$set: updateDoc});
      logger.info("Ingredient details updated: ", id);
    }
  },

  archiveIngredient: function(id, status) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to delete ingredients");
      throw new Meteor.Error(403, "User not permitted to delete ingredients");
    }
    if(!id) {
      logger.error("Id field not found");
      throw new Meteor.Error(404, "Id field not found");
    }
    var item = Ingredients.findOne(id);
    if(!item) {
      logger.error("Item not found");
      throw new Meteor.Error(404, "Item not found");
    }


    if(status == 'delete') {
      var existInPreps = JobItems.findOne(
        {"type": "Prep", "ingredients": {$elemMatch: {"_id": id}}},
        {fields: {"ingredients": {$elemMatch: {"_id": id}}}}
      );
      if(existInPreps) {
        if(existInPreps.ingredients.length > 0) {
          logger.error("Item found in Prep jobs, can't delete. Archiving ingredient");
        }
      }
      var existInMenuItems = MenuItems.findOne(
        {"ingredients": {$elemMatch: {"_id": id}}},
        {fields: {"ingredients": {$elemMatch: {"_id": id}}}}
      );
      if(existInMenuItems) {
        if(existInMenuItems.ingredients.length > 0) {
          logger.error("Item found in Menu Items, can't delete. Archiving ingredient", id);
        }
      }

      var existInStocktakes = Stocktakes.findOne({"stockId": id});
      if(existInStocktakes) {
        logger.error("Item found in stock counting, can't delete. Archiving ingredient");
      }

      if(existInPreps || existInMenuItems || existInStocktakes) {
        throw  new Meteor.Error(404, "Stock item cannot be deleted, archived");
      } else {
        Ingredients.remove(id);
        logger.info("Ingredient deleted", id);
      }
    } else if(status == "archive") {
      Ingredients.update({"_id": id}, {$set: {"status": "archived"}});
      logger.error("Stock item archived ", id);
    } else if(status == "restore") {
      Ingredients.update({"_id": id}, {$set: {"status": "active"}});
      logger.error("Stock item restored ", id);
    }
    return;
  },

  ingredientsCount: function() {
    return Ingredients.find().count();
  },
});
