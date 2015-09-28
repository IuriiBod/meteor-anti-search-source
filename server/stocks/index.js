Meteor.methods({
  createIngredients: function(info) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    check(info, Object);

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
    info.costPerPortion = parseFloat(info.costPerPortion) || 0;
    info.unitSize = parseFloat(info.unitSize) || 0;
    info.portionOrdered = info.portionOrdered || null;
    info.portionUsed = info.portionUsed || null;

    var doc = {
      "code": info.code,
      "description": info.description,
      "suppliers": info.suppliers,
      "portionOrdered": info.portionOrdered,
      "costPerPortion": info.costPerPortion,
      "portionUsed": info.portionUsed,
      "unitSize": info.unitSize,
      "status": "active",
      "createdOn": Date.now(),
      "createdBy": Meteor.userId(),
      relations: HospoHero.getRelationsObject()
    };
    var id = Ingredients.insert(doc);
    logger.info("New ingredient inserted ", id);
    return id;
  },

  editIngredient: function(id, info) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    HospoHero.checkMongoId(id);

    var item = Ingredients.findOne({_id: id});
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
      updateDoc['editedBy'] = Meteor.userId();
      Ingredients.update({'_id': id}, {$set: updateDoc});
      logger.info("Ingredient details updated: ", id);
    }
  },

  archiveIngredient: function(id, remove) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    HospoHero.checkMongoId(id);

    var item = Ingredients.findOne(id);
    if(!item) {
      logger.error("Item not found");
      throw new Meteor.Error(404, "Item not found");
    }
    var status = null;
    if(item.status) {
      status = item.status == 'active' ? 'archived' : remove ? 'archived' : 'active';
    } else {
      status = 'archived';
    }

    if(status == 'archived') {
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
        Ingredients.update({"_id": id}, {$set: {"status": status}});
      } else {
        Ingredients.remove(id);
        logger.info("Ingredient removed", id);
        return true;
      }
    } else {
      Ingredients.update({"_id": id}, {$set: {"status": status}});
      logger.error("Stock item restored ", id);
      return true;
    }
  },

  ingredientsCount: function() {
    return Ingredients.find({
      "relations.areaId": HospoHero.getDefaultArea()
    }).count();
  }
});
