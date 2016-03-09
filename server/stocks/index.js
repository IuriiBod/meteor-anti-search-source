var canUserEditStocks = function(areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit stocks');
};

var getAreaIdFromIngredient = function (ingredientId) {
  var ingredient = Ingredients.findOne({_id: ingredientId});
  return (ingredient && ingredient.relations) ? ingredient.relations.areaId : null;
};

Meteor.methods({
  createIngredients: function (info) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    check(info, Object);

    if (!info.code) {
      logger.error("Code field not found");
      throw new Meteor.Error(404, "Code field not found");
    }
    if (!info.description) {
      logger.error("Description field not found");
      throw new Meteor.Error(404, "Description field not found");
    }
    var exist = Ingredients.findOne({
      code: info.code,
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
    if (exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change code and try again");
    }
    info.costPerPortion = parseFloat(info.costPerPortion) || 0;
    info.unitSize = parseFloat(info.unitSize) || 0;
    info.portionOrdered = info.portionOrdered || null;
    info.portionUsed = info.portionUsed || null;

    var doc = {
      code: info.code,
      description: info.description,
      suppliers: info.suppliers,
      portionOrdered: info.portionOrdered,
      costPerPortion: info.costPerPortion,
      portionUsed: info.portionUsed,
      unitSize: info.unitSize,
      status: "active",
      createdOn: Date.now(),
      createdBy: Meteor.userId(),
      relations: HospoHero.getRelationsObject()
    };
    var id = Ingredients.insert(doc);
    logger.info("New ingredient inserted ", id);
    return id;
  },

  editIngredient: function (id, info) {
    check(id, HospoHero.checkers.MongoId);

    if (!canUserEditStocks(getAreaIdFromIngredient(id))) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }


    var item = Ingredients.findOne({_id: id});
    if (!item) {
      logger.error("Item not found");
      throw new Meteor.Error(404, "Item not found");
    }
    if (Object.keys(info).length < 0) {
      logger.error("No editing fields found");
      throw new Meteor.Error(404, "No editing fields found");
    }
    var updateDoc = {};
    if (info.code) {
      if (item.code !== info.code) {
        updateDoc.code = info.code;
      }
    }
    if (info.description) {
      if (item.description !== info.description) {
        updateDoc.description = info.description;
      }
    }
    if (info.suppliers) {
      updateDoc.suppliers = info.suppliers;
    }
    if (info.portionOrdered) {
      if (item.portionOrdered !== info.portionOrdered) {
        updateDoc.portionOrdered = info.portionOrdered;
      }
    }
    if (info.unitSize) {
      if (item.unitSize !== info.unitSize) {
        updateDoc.unitSize = parseFloat(info.unitSize);
      }
    }
    if (info.costPerPortion) {
      if (info.costPerPortion === info.costPerPortion) {
        if (item.costPerPortion !== info.costPerPortion) {
          updateDoc.costPerPortion = parseFloat(info.costPerPortion);
        }
      }
    }
    if (info.portionUsed) {
      if (item.portionUsed !== info.portionUsed) {
        updateDoc.portionUsed = info.portionUsed;
      }
    }
    if (Object.keys(updateDoc).length > 0) {
      updateDoc.editedOn = Date.now();
      updateDoc.editedBy = Meteor.userId();
      Ingredients.update({_id: id}, {$set: updateDoc});
      logger.info("Ingredient details updated: ", id);
    }
  },

  archiveIngredient: function (id, status) {
    if (!canUserEditStocks(getAreaIdFromIngredient(id))) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    check(id, HospoHero.checkers.MongoId);

    var item = Ingredients.findOne(id);
    if (!item) {
      logger.error("Item not found");
      throw new Meteor.Error(404, "Item not found");
    }

    if (status === 'archive') {
      var prepId = JobTypes.findOne({name: 'Prep'})._id;
      var existInPreps = JobItems.find(
        {type: prepId, ingredients: {$elemMatch: {_id: id}}, status: 'active'},
        {fields: {ingredients: {$elemMatch: {_id: id}}, name: 1}}
      );
      var existInMenuItems = MenuItems.find(
        {ingredients: {$elemMatch: {"_id": id}}, status: 'active'},
        {fields: {ingredients: {$elemMatch: {"_id": id}}, name: 1}}
      );

      if (existInPreps.count() || existInMenuItems.count()) {
        var error = [];
        error.push("Can't archive item! Remove it form next items first:\n");
        error.push(existingItemsFormat(existInPreps, 'Jobs'));
        error.push(existingItemsFormat(existInMenuItems, 'Menus'));

        logger.error(404, error.join(''));
        throw new Meteor.Error(404, error.join(''));
      }
      var existInStocktakes = Stocktakes.findOne({stockId: id});
      if (existInStocktakes) {
        logger.error("Item found in stock counting, can't archive");
        throw new Meteor.Error("Item found in stock counting, can't archive");
      }
    }

    if (status === "archive") {
      Ingredients.update({_id: id}, {$set: {status: "archived"}});
      logger.error("Stock item archived ", id);
    } else if (status === "restore") {
      Ingredients.update({_id: id}, {$set: {status: "active"}});
      logger.error("Stock item restored ", id);
    } else {
      Ingredients.remove(id);
      logger.info("Ingredient deleted", id);
    }
  },

  duplicateIngredient: function (ingredientId, areaId, quantity) {
    if (!canUserEditStocks(areaId)) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    var ingredient = Ingredients.findOne({_id: ingredientId});

    if (ingredient && ingredient.relations.areaId !== areaId) {
      var existsItem = Ingredients.findOne({'relations.areaId': areaId, description: ingredient.description});

      if (existsItem) {
        ingredientId = existsItem._id;
      } else {
        ingredient = HospoHero.misc.omitAndExtend(ingredient, ['_id', 'relations', 'specialAreas', 'generalAreas'], areaId);

        if (ingredient.suppliers) {
          ingredient.suppliers = duplicateSupplier(ingredient.suppliers, areaId);
        }
        ingredientId = Ingredients.insert(ingredient);
      }
    }

    return quantity === false ? ingredientId : {_id: ingredientId, quantity: quantity};
  }
});

var duplicateSupplier = function (supplierId, areaId) {
  var supplier = Suppliers.findOne({_id: supplierId});
  if (supplier && supplier.relations && supplier.relations.areaId !== areaId) {
    var existsSupplier = Suppliers.findOne({'relations.areaId': areaId, name: supplier.name});
    if (existsSupplier) {
      supplierId = existsSupplier._id;
    } else {
      supplier = HospoHero.misc.omitAndExtend(supplier, ['_id', 'relations'], areaId);
      supplierId = Suppliers.insert(supplier);
    }
  }
  return supplierId;
};

var existingItemsFormat = function (items, title) {
  var error = [];
  if (items.count()) {
    error.push('\n' + title + ': \n');
    items.forEach(function (item) {
      error.push('- ' + item.name + '\n');
    });
  }
  return error.join('');
};