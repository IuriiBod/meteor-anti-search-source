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
    var newStocktakeDoc = {
      date: localDateMoment.startOf('day').toDate(),
      relations: relationsObject
    };

    var newStocktakeId = Stocktakes.insert(newStocktakeDoc);
    logger.info('Created new stocktake', newStocktakeId);
    return newStocktakeId;
  },

  createStockItem: function (newStockItem) {
    check(newStockItem, HospoHero.checkers.StockItemDocument);

    if (!canUserEditStocks(newStockItem.relations.areaId)) {
      logger.error("User not permitted to update stocktakes");
      throw new Meteor.Error(403, "User not permitted to update stocktakes");
    }

    let newStockItemId = StockItems.insert(newStockItem);
    logger.info('Create new stock item', newStockItemId);
    return newStockItemId;
  },

  updateStockItem: function (updatedStockItem) {
    check(updatedStockItem, HospoHero.checkers.StockItemDocument);

    if (!canUserEditStocks(updatedStockItem.relations.areaId)) {
      logger.error("User not permitted to update stocktakes");
      throw new Meteor.Error(403, "User not permitted to update stocktakes");
    }

    StockItems.update({_id: updatedStockItem._id}, {$set: updatedStockItem});
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