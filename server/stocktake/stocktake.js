var canUserEditStocks = function (areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit stocks');
};

Meteor.methods({
  createStocktake: function () {
    if (!canUserEditStocks()) {
      logger.error('User not permitted to generate stocktakes');
      throw new Meteor.Error(403, 'User not permitted to generate stocktakes');
    }

    let relationsObject = HospoHero.getRelationsObject();
    let localDateMoment = HospoHero.dateUtils.getDateMomentForLocation(new Date(), relationsObject.locationId);
    let stocktakeDate = localDateMoment.startOf('day').toDate();

    let lastStocktake = Stocktakes.findOne({'relations.areaId': relationsObject.areaId}, {sort: {date: -1 }});

    let todaysStocktakeExists = checkIfTodaysStocktakeExists(lastStocktake, stocktakeDate);

    let nonCompletedPreviousStocktake = checkIfNonCompletedPreviousStocktake(relationsObject, lastStocktake);

    if (todaysStocktakeExists) {
      throw new Meteor.Error(500, 'Stocktake for today is already exists');
    } else {
      if (nonCompletedPreviousStocktake) {
        let newStocktakeDoc = {
          date: stocktakeDate,
          relations: relationsObject
        };

        let newStocktakeId = Stocktakes.insert(newStocktakeDoc);
        logger.info('Created new stocktake', newStocktakeId);
        return newStocktakeId;
      } else {
        throw new Meteor.Error(500, 'Complete previous stocktake please');
      }
    }
  },

  upsertStockItem: function (updatedStockItem) {
    check(updatedStockItem, HospoHero.checkers.StockItemDocument);

    if (!canUserEditStocks(updatedStockItem.relations.areaId)) {
      logger.error('User not permitted to update stocktakes');
      throw new Meteor.Error(403, 'User not permitted to update stocktakes');
    }

    let stockItemId;
    if (updatedStockItem._id) {
      stockItemId = updatedStockItem._id;
      delete updatedStockItem._id;
      StockItems.update({_id: stockItemId}, {$set: updatedStockItem});
    } else {
      stockItemId = StockItems.insert(updatedStockItem);
    }

    logger.info('Stock item updated', stockItemId);
  },

  upsertStockPrepItem: (updatedStockPrepItem) => {
    check(updatedStockPrepItem, HospoHero.checkers.StockPrepItemDocument);

    if (!canUserEditStocks(updatedStockPrepItem.relations.areaId)) {
      logger.error('User not permitted to update stocktakes');
      throw new Meteor.Error(403, 'User not permitted to update stocktakes');
    }

    if (updatedStockPrepItem._id) {
      const stockPrepItemId = updatedStockPrepItem._id;
      delete updatedStockPrepItem._id;
      StockPrepItems.update({_id: stockPrepItemId}, {$set: updatedStockPrepItem});
    } else {
      StockPrepItems.insert(updatedStockPrepItem);
    }

    logger.info('Stock prep item updated', updatedStockPrepItem._id);
  },

  removeEmptyStocktake: function (stocktakeId) {
    check(stocktakeId, String);

    if (!canUserEditStocks()) {
      logger.error('User not permitted to remove stocktakes');
      throw new Meteor.Error(403, 'User not permitted to remove stocktakes');
    }

    let stockItems = StockItems.find({stocktakeId: stocktakeId});

    if (!stockItems.count()) {
      Stocktakes.remove({_id: stocktakeId});
    } else {
      throw new Meteor.Error(500, 'Stocktake is not empty');
    }
  }
});

function checkIfNonCompletedPreviousStocktake (relationsObject, lastStocktake) {
  let lastStocktakeId = lastStocktake && lastStocktake._id;
  let lastStocktakeStockItemsNumber = StockItems.find({stocktakeId: lastStocktakeId}).count();

  let specialStockAreas = StockAreas.find({'relations.areaId': relationsObject.areaId, generalAreaId: {$exists: 1}}).fetch();
  let requiredStockItemsNumber = specialStockAreas.reduce((number, currentEl) => {
    let ingredientsLength = currentEl.ingredientsIds.length;

    return number += ingredientsLength;
  }, 0);

  let lastStocktakeOrdersExist = !!Orders.find({stocktakeId: lastStocktakeId}).count();

  return lastStocktakeOrdersExist || lastStocktakeStockItemsNumber === requiredStockItemsNumber;
}

function checkIfTodaysStocktakeExists (lastStocktake, stocktakeDate) {
  return lastStocktake.date.getDate() === stocktakeDate.getDate();
}