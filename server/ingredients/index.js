let canUserEditStocks = function (areaId = null) {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit stocks');
};

let getAreaIdFromIngredient = function (ingredientId) {
  let ingredient = Ingredients.findOne({_id: ingredientId});
  return (ingredient && ingredient.relations) ? ingredient.relations.areaId : null;
};

Meteor.methods({
  createIngredients: function (ingredientDoc) {
    check(ingredientDoc, HospoHero.checkers.IngredientDocument);

    if (!canUserEditStocks()) {
      logger.error('User not permitted to create ingredients');
      throw new Meteor.Error(403, 'User not permitted to create ingredients');
    }

    let exist = Ingredients.findOne({
      code: ingredientDoc.code,
      'relations.areaId': HospoHero.getCurrentAreaId()
    });

    if (exist) {
      logger.error('Duplicate entry');
      throw new Meteor.Error(404, 'Duplicate entry, change code and try again');
    }

    _.extend(ingredientDoc, {
      costPerPortion: parseFloat(ingredientDoc.costPerPortion) || 0,
      unitSize: parseFloat(ingredientDoc.unitSize) || 0,
      portionOrdered: ingredientDoc.portionOrdered || null,
      portionUsed: ingredientDoc.portionUsed || null,
      createdOn: Date.now(),
      createdBy: Meteor.userId(),
      relations: HospoHero.getRelationsObject()
    });

    return Ingredients.insert(ingredientDoc);
  },

  editIngredient: function (updatedIngredient) {
    check(updatedIngredient, HospoHero.checkers.IngredientDocument);

    if (!canUserEditStocks(getAreaIdFromIngredient(updatedIngredient._id))) {
      logger.error('User not permitted to create ingredients');
      throw new Meteor.Error(403, 'User not permitted to create ingredients');
    }

    _.extend(updatedIngredient, {
      editedOn: Date.now(),
      editedBy: Meteor.userId()
    });

    return Ingredients.update({_id: updatedIngredient._id}, {$set: updatedIngredient});
  },

  archiveIngredient: function (id, status) {
    check(id, HospoHero.checkers.MongoId);

    if (!canUserEditStocks(getAreaIdFromIngredient(id))) {
      logger.error('User not permitted to create ingredients');
      throw new Meteor.Error(403, 'User not permitted to create ingredients');
    }

    if (status === 'archive') {
      let ingredientIsInRelatedItems = findIngredientInRelatedItems(id);
      if (ingredientIsInRelatedItems) {
        throw new Meteor.Error(404, ingredientIsInRelatedItems);
      }

      removeIngredientFromRelatedCollections(id);
    }

    if (status === 'delete') {
      return Ingredients.remove({_id: id});
    } else {
      let statusName = status === 'archive' ? 'archived' : 'active';
      return Ingredients.update({_id: id}, {$set: {status: statusName}});
    }
  },

  duplicateIngredient: function (ingredientId, areaId, quantity) {
    if (!canUserEditStocks(areaId)) {
      logger.error('User not permitted to create ingredients');
      throw new Meteor.Error(403, 'User not permitted to create ingredients');
    }

    let ingredient = Ingredients.findOne({_id: ingredientId});

    if (ingredient && ingredient.relations.areaId !== areaId) {
      let existsItem = Ingredients.findOne({'relations.areaId': areaId, description: ingredient.description});

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

let duplicateSupplier = function (supplierId, areaId) {
  let supplier = Suppliers.findOne({_id: supplierId});
  if (supplier && supplier.relations && supplier.relations.areaId !== areaId) {
    let existsSupplier = Suppliers.findOne({'relations.areaId': areaId, name: supplier.name});
    if (existsSupplier) {
      supplierId = existsSupplier._id;
    } else {
      supplier = HospoHero.misc.omitAndExtend(supplier, ['_id', 'relations'], areaId);
      supplierId = Suppliers.insert(supplier);
    }
  }
  return supplierId;
};

let findIngredientInRelatedItems = function (id) {
  let prepId = JobTypes.findOne({name: 'Prep'})._id;
  let existInPreps = JobItems.find({
    type: prepId,
    ingredients: {
      $elemMatch: {_id: id}
    },
    status: 'active'
  });

  let existInMenuItems = MenuItems.find({
    ingredients: {
      $elemMatch: {_id: id}
    },
    status: 'active'
  });

  if (existInPreps.count() || existInMenuItems.count()) {
    let error = [];
    error.push('Can\'t archive item! Remove it form next items first:\n');
    error.push(existingItemsFormat(existInPreps, 'Jobs'));
    error.push(existingItemsFormat(existInMenuItems, 'Menus'));

    return error.join('');
  } else {
    return false;
  }
};

let existingItemsFormat = function (items, title) {
  let error = [];
  if (items.count()) {
    error.push('\n' + title + ': \n');
    items.forEach(function (item) {
      error.push('- ' + item.name + '\n');
    });
  }
  return error.join('');
};

let removeIngredientFromRelatedCollections = function (id) {
  // remove ingredient from stocktake
  OrderItems.remove({'ingredient.id': id});
  StockItems.remove({'ingredient.id': id});
  StockAreas.remove({ingredientIds: id});

  // remove related items from collection
  TaskList.remove({'reference.id': id});
  RelatedItems.remove({referenceId: id});
};