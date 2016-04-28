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

    let existingStocktake = Stocktakes.findOne({date: stocktakeDate, 'relations.areaId': relationsObject.areaId});
    if (!existingStocktake) {
      let newStocktakeDoc = {
        date: stocktakeDate,
        relations: relationsObject
      };

      let newStocktakeId = Stocktakes.insert(newStocktakeDoc);
      logger.info('Created new stocktake', newStocktakeId);
      return newStocktakeId;
    } else {
      throw new Meteor.Error(500, 'Stocktake for today is already exists');
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
  }
});