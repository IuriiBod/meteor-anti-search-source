var canUserEditStocks = function (areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit stocks');
};


Meteor.methods({
  createStocktake: function () {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to generate stocktakes");
      throw new Meteor.Error(403, "User not permitted to generate stocktakes");
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
      logger.error("User not permitted to update stocktakes");
      throw new Meteor.Error(403, "User not permitted to update stocktakes");
    }

    if (updatedStockItem._id) {
      let stockItemId = updatedStockItem._id;
      delete updatedStockItem._id;
      StockItems.update({_id: stockItemId}, {$set: updatedStockItem});
    } else {
      StockItems.insert(updatedStockItem);
    }

    logger.info('Stock item updated', updatedStockItem._id);
  },

  removeStockItem: function (stockItemId) {
    check(stockItemId, HospoHero.checkers.StockItemId);

    var stockItem = StockItems.findOne({_id: stockItemId});
    if (!canUserEditStocks(stockItem.relations.areaId)) {
      logger.error("User not permitted to remove stocktakes");
      throw new Meteor.Error(403, "User not permitted to remove stocktakes");
    }

    if (stockItem.orderId) {
      logger.error("Can't remove stocktake. Order has been placed already");
      throw new Meteor.Error("Can't remove stocktake. Order has been placed already");
    }

    StockItems.remove({_id: stockItemId});
    logger.info("Stocktake removed", stockItemId);
  }
});