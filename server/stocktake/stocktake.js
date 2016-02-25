var canUserEditStocks = function() {
  var checker = new HospoHero.security.PermissionChecker(Meteor.userId());
  return checker.hasPermissionInArea(HospoHero.getCurrentAreaId(), 'edit stocks');
};

Meteor.methods({
  'createMainStocktake': function (date) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to generate stocktakes");
      throw new Meteor.Error(403, "User not permitted to generate stocktakes");
    }
    var doc = {
      "stocktakeDate": new Date(date).getTime(),
      "date": new Date(),
      "generalAreas": [],
      "specialAreas": [],
      relations: HospoHero.getRelationsObject()
    };
    var generalAreas = GeneralAreas.find({"active": true}).fetch();
    if (generalAreas && generalAreas.length > 0) {
      generalAreas.forEach(function (area) {
        if (doc.generalAreas.indexOf(area._id) < 0) {
          doc['generalAreas'].push(area._id);
        }
      });
    }
    var specialAreas = SpecialAreas.find({"active": true}).fetch();
    if (specialAreas && specialAreas.length > 0) {
      specialAreas.forEach(function (area) {
        if (doc.specialAreas.indexOf(area._id) < 0) {
          doc['specialAreas'].push(area._id);
        }
      });
    }
    var id = StocktakeMain.insert(doc);
    logger.info("Creating new stocktake", date, id);
    return id;
  },

  'generateStocktakes': function (stocktakeDate) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to generate stocktakes");
      throw new Meteor.Error(403, "User not permitted to generate stocktakes");
    }
    var mainId;
    var stocktakeMain = StocktakeMain.find({"stocktakeDate": stocktakeDate}, {sort: {"date": -1}, limit: 1}).fetch();

    if (!stocktakeMain.length > 0) {
      var doc = {
        "stocktakeDate": new Date(date).getTime(),
        "date": Date.now(),
        relations: HospoHero.getRelationsObject()
      };
      mainId = StocktakeMain.insert(doc);
    } else {
      mainId = stocktakeMain[0]._id;
    }
    var specialAreas = SpecialAreas.find({
      "relations.areaId": HospoHero.getCurrentAreaId()
    }).fetch();

    if (specialAreas.length > 0) {
      specialAreas.forEach(function (area) {
        if (area && area.stocks.length > 0) {
          area.stocks.forEach(function (id) {
            var existingStocktake = Stocktakes.findOne({
              "date": new Date(stocktakeDate).getTime(),
              "version": mainId,
              "generalArea": area.generalArea,
              "specialArea": area._id,
              "stockId": id
            });
            if (!existingStocktake) {
              var ingredient = Ingredients.findOne(id);
              if (ingredient) {
                var place = area.stocks.indexOf(id);
                var doc = {
                  "version": mainId,
                  "date": new Date(stocktakeDate).getTime(),
                  "generalArea": area.generalArea,
                  "specialArea": area._id,
                  "stockId": id,
                  "counting": 0,
                  "createdAt": Date.now(),
                  "place": place,
                  "unit": ingredient.portionOrdered,
                  "unitCost": ingredient.costPerPortion,
                  "status": false,
                  "orderRef": null,
                  "orderedCount": 0,
                  relations: HospoHero.getRelationsObject()
                };
                Stocktakes.insert(doc);
              }
            }
          });
        }
      });
      logger.info("Stocktakes inserted for date", stocktakeDate);
    }
  },

  'updateStocktake': function (id, info, newValue) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to update stocktakes");
      throw new Meteor.Error(403, "User not permitted to update stocktakes");
    }
    var mainStocktake = StocktakeMain.findOne(info.version);
    if (!mainStocktake) {
      logger.error('Stocktake main does not exist');
      throw new Meteor.Error('Stocktake main does not exist');
    }

    var stockTakeExists = Stocktakes.findOne(id);
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
      setQuery['counting'] = parseFloat(info.counting) || 0;
      if (stockTakeExists.status) {
        setQuery['status'] = false;
        setQuery['orderedCount'] = stockTakeExists.counting;
      }

      if (info.hasOwnProperty("place")) {
        setQuery['place'] = info.place;
      }

      Stocktakes.update({"_id": id}, {$set: setQuery});
      logger.info("Stocktake updated", stockTakeExists._id);

    } else {
      var stock = Ingredients.findOne(info.stockId);
      if (!stock) {
        logger.error("Stock item does not exist");
        throw new Meteor.Error(403, "Stock item does not exist");
      }
      var generalArea = GeneralAreas.findOne(info.generalArea);
      if (!generalArea) {
        logger.error("General area does not exist");
        throw new Meteor.Error(403, "General area does not exist");
      }
      var specialArea = SpecialAreas.findOne(info.specialArea);
      if (!specialArea) {
        logger.error("Special area does not exist");
        throw new Meteor.Error(403, "Special area does not exist");
      }

      var place = specialArea.stocks.indexOf(info.stockId);
      var doc = {
        "version": info.version,
        "date": new Date(mainStocktake.stocktakeDate).getTime(),
        "generalArea": info.generalArea,
        "specialArea": info.specialArea,
        "stockId": info.stockId,
        "counting": info.counting,
        "createdAt": Date.now(),
        "place": place,
        "unit": stock.portionOrdered,
        "unitCost": stock.costPerPortion,
        "status": false,
        "orderRef": null,
        "orderedCount": 0,
        relations: HospoHero.getRelationsObject()
      };
      id = Stocktakes.insert(doc);
      logger.info("New stocktake created", id, place);

      StocktakeMain.update({"_id": info.version}, {
        $addToSet: {
          "generalAreas": info.generalArea,
          "specialAreas": info.specialArea
        }
      });
      logger.info("Stocktake main updated with areas", info.version);
    }
  },

  removeStocktake: function (stocktakeId) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to remove stocktakes");
      throw new Meteor.Error(403, "User not permitted to remove stocktakes");
    }
    var stockItemExists = Stocktakes.findOne(stocktakeId);
    if (!stockItemExists) {
      logger.error('Stock item does not exist in stocktake', {"stockId": stockId, "stocktakeId": stocktakeId});
      throw new Meteor.Error("Stock item does not exist in stocktake");
    }
    if (stockItemExists.status && stockItemExists.orderRef) {
      logger.error("Can't remove stocktake. Order has been placed already");
      throw new Meteor.Error("Can't remove stocktake. Order has been placed already");
    }
    Stocktakes.remove({"_id": stocktakeId});
    logger.info("Stocktake removed", stocktakeId);
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
      Stocktakes.update({"_id": sortedStockItems.draggedItem.id}, {$set: {"place": sortedStockItems.draggedItem.place}});
      logger.info("Stocktake position updated");
    }

    if (sortedStockItems.stocks) {
      SpecialAreas.update({"_id": sortedStockItems.activeSpecialArea}, {$set: {"stocks": sortedStockItems.stocks}});
    }

  }
});