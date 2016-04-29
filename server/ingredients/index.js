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
      status: 'active',
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
    if (!canUserEditStocks(getAreaIdFromIngredient(id))) {
      logger.error('User not permitted to create ingredients');
      throw new Meteor.Error(403, 'User not permitted to create ingredients');
    }

    check(id, HospoHero.checkers.MongoId);

    let item = Ingredients.findOne(id);
    if (!item) {
      logger.error('Item not found');
      throw new Meteor.Error(404, 'Item not found');
    }

    if (status === 'archive') {
      let prepId = JobTypes.findOne({name: 'Prep'})._id;
      let existInPreps = JobItems.find(
        {type: prepId, ingredients: {$elemMatch: {_id: id}}, status: 'active'},
        {fields: {ingredients: {$elemMatch: {_id: id}}, name: 1}}
      );
      let existInMenuItems = MenuItems.find(
        {ingredients: {$elemMatch: {_id: id}}, status: 'active'},
        {fields: {ingredients: {$elemMatch: {_id: id}}, name: 1}}
      );

      if (existInPreps.count() || existInMenuItems.count()) {
        let error = [];
        error.push('Can\'t archive item! Remove it form next items first:\n');
        error.push(existingItemsFormat(existInPreps, 'Jobs'));
        error.push(existingItemsFormat(existInMenuItems, 'Menus'));

        logger.error(404, error.join(''));
        throw new Meteor.Error(404, error.join(''));
      }

      // remove ingredient from stocktake
      OrderItems.remove({'ingredient.id': id});
      StockItems.remove({'ingredient.id': id});
      StockAreas.remove({ingredientIds: id});
    }

    if (status === 'archive') {
      Ingredients.update({_id: id}, {$set: {status: 'archived'}});
      logger.error('Stock item archived ', id);
    } else if (status === 'restore') {
      Ingredients.update({_id: id}, {$set: {status: 'active'}});
      logger.error('Stock item restored ', id);
    } else {
      Ingredients.remove(id);
      logger.info('Ingredient deleted', id);
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