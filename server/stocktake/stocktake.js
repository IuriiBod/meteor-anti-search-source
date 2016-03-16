var canUserEditStocks = function (areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit stocks');
};

var getAreaIdFromStocktake = function (stockItemId) {
  var stocktake = StockItems.findOne({_id: stockItemId});
  return (stocktake && stocktake.relations) ? stocktake.relations.areaId : null;
};

Meteor.methods({
  createMainStocktake: function (date) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to generate stocktakes");
      throw new Meteor.Error(403, "User not permitted to generate stocktakes");
    }
    let relationsObject = HospoHero.getRelationsObject();
    var doc = {
      stocktakeDate: new Date(date).getTime(),
      date: new Date(),
      generalAreas: [],
      specialAreas: [],
      relations: relationsObject
    };

    var generalAreas = StockAreas.find({
      generalAreaId: {$exists: false},
      active: true,
      'relations.areaId': relationsObject.areaId
    }).fetch();

    if (generalAreas && generalAreas.length > 0) {
      generalAreas.forEach(function (area) {
        if (doc.generalAreas.indexOf(area._id) < 0) {
          doc.generalAreas.push(area._id);
        }
      });
    }
    var specialAreas = StockAreas.find({
      generalAreaId: {$exists: true},
      active: true,
      'relations.areaId': relationsObject.areaId
    }).fetch();

    if (specialAreas && specialAreas.length > 0) {
      specialAreas.forEach(function (area) {
        if (doc.specialAreas.indexOf(area._id) < 0) {
          doc.specialAreas.push(area._id);
        }
      });
    }
    var id = Stocktakes.insert(doc);
    logger.info("Creating new stocktake", date, id);
    return id;
  },

  updateStocktake: function (stockItemId, info) {
    if (!canUserEditStocks(getAreaIdFromStocktake(stockItemId))) {
      logger.error("User not permitted to update stocktakes");
      throw new Meteor.Error(403, "User not permitted to update stocktakes");
    }
    var mainStocktake = Stocktakes.findOne({_id: info.version});
    if (!mainStocktake) {
      logger.error('Stocktake main does not exist');
      throw new Meteor.Error('Stocktake main does not exist');
    }

    var stockTakeExists = StockItems.findOne({_id: stockItemId});
    if (stockTakeExists) {
      var setQuery = {};
      /**
       * Just save this for history
       *
       * var counting = parseFloat(info.counting);
       * if (counting != counting) {
       *   counting = 0;
       * }
       */
      setQuery.counting = parseFloat(info.counting) || 0;
      if (stockTakeExists.status) {
        setQuery.status = false;
        setQuery.orderedCount = stockTakeExists.counting;
      }

      if (info.hasOwnProperty("place")) {
        setQuery.place = info.place;
      }

      StockItems.update({_id: stockItemId}, {$set: setQuery});
      logger.info("Stocktake updated", stockTakeExists._id);

    } else {
      var stock = Ingredients.findOne(info.stockId);
      if (!stock) {
        logger.error("Stock item does not exist");
        throw new Meteor.Error(403, "Stock item does not exist");
      }
      var generalArea = StockAreas.findOne({_id: info.generalArea});
      if (!generalArea) {
        logger.error("General area does not exist");
        throw new Meteor.Error(403, "General area does not exist");
      }
      var specialArea = StockAreas.findOne({_id: info.specialArea});
      if (!specialArea) {
        logger.error("Special area does not exist");
        throw new Meteor.Error(403, "Special area does not exist");
      }

      var place = specialArea.stocks.indexOf(info.stockId);
      var doc = {
        version: info.version,
        date: new Date(mainStocktake.stocktakeDate).getTime(),
        generalArea: info.generalArea,
        specialArea: info.specialArea,
        stockId: info.stockId,
        counting: info.counting,
        createdAt: Date.now(),
        place: place,
        unit: stock.portionOrdered,
        unitCost: stock.costPerPortion,
        status: false,
        orderRef: null,
        orderedCount: 0,
        relations: HospoHero.getRelationsObject()
      };
      stockItemId = StockItems.insert(doc);
      logger.info("New stocktake created", stockItemId, place);

      Stocktakes.update({_id: info.version}, {
        $addToSet: {
          generalAreas: info.generalArea,
          specialAreas: info.specialArea
        }
      });
      logger.info("Stocktake main updated with areas", info.version);
    }
  },

  removeStocktake: function (stockItemId) {
    if (!canUserEditStocks(getAreaIdFromStocktake(stockItemId))) {
      logger.error("User not permitted to remove stocktakes");
      throw new Meteor.Error(403, "User not permitted to remove stocktakes");
    }
    var stockItemExists = StockItems.findOne({_id: stockItemId});
    if (!stockItemExists) {
      logger.error('Stocktake does not exist', {stocktakeId: stockItemId});
      throw new Meteor.Error("Stock item does not exist in stocktake");
    }
    if (stockItemExists.status && stockItemExists.orderRef) {
      logger.error("Can't remove stocktake. Order has been placed already");
      throw new Meteor.Error("Can't remove stocktake. Order has been placed already");
    }
    StockItems.remove({_id: stockItemId});
    logger.info("Stocktake removed", stockItemId);
  },

  stocktakePositionUpdate: function (sortedStockItems) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to update stocktake position");
      throw new Meteor.Error(403, "User not permitted to update stocktake position");
    }
    check(sortedStockItems, {
      draggedItem: Match.OneOf(String, {
        id: Match.Optional(String),
        place: Match.Optional(Number)
      }),
      stocks: Match.OneOf(Array, null),
      activeSpecialArea: Match.Optional(String)
    });

    if (sortedStockItems.draggedItem.place) {
      StockItems.update({_id: sortedStockItems.draggedItem.id}, {$set: {place: sortedStockItems.draggedItem.place}});
      logger.info("Stocktake position updated");
    }

    if (sortedStockItems.stocks) {
      StockAreas.update({_id: sortedStockItems.activeSpecialArea}, {$set: {ingredients: sortedStockItems.stocks}});
    }

  }
});