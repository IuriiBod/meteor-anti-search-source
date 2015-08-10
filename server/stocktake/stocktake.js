Meteor.methods({
  'createMainStocktake': function(date) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to generate stocktakes");
      throw new Meteor.Error(403, "User not permitted to generate stocktakes");
    }
    var doc = {
      "stocktakeDate": new Date(date).getTime(),
      "date": Date.now()
    }
    var id = StocktakeMain.insert(doc);
    logger.info("Creating new stocktake", date, id);
    return id;
  },

  'generateStocktakes': function(stocktakeDate) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to generate stocktakes");
      throw new Meteor.Error(403, "User not permitted to generate stocktakes");
    }
    var mainId = null;
    var stocktakeMain = StocktakeMain.find({"stocktakeDate": stocktakeDate}, {sort: {"date": -1}, limit: 1}).fetch();

    if(!stocktakeMain.length > 0) {
      var doc = {
      "stocktakeDate": new Date(date).getTime(),
        "date": Date.now()
      }
      mainId = StocktakeMain.insert(doc);
    } else {
      mainId = stocktakeMain[0]._id;
    }
    var specialAreas = SpecialAreas.find().fetch();
    
    if(specialAreas.length > 0) {
      specialAreas.forEach(function(area) {
        if(area && area.stocks.length > 0) {
          area.stocks.forEach(function(id) {
            var existingStocktake = Stocktakes.findOne({
              "date": new Date(stocktakeDate).getTime(),
              "version": mainId,
              "generalArea": area.generalArea,
              "specialArea": area._id,
              "stockId": id
            });
            if(!existingStocktake) {
              var ingredient = Ingredients.findOne(id);
              if(ingredient) {
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
                  "orderedCount": 0
                }
                Stocktakes.insert(doc);
              }
            }
          });
        }
      });
      logger.info("Stocktakes inserted for date", stocktakeDate)
      return;
    }
  },

  'updateStocktake': function(id, info) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to update stocktakes");
      throw new Meteor.Error(403, "User not permitted to update stocktakes");
    }

    var stockTakeExists = Stocktakes.findOne(id);
    if(stockTakeExists) {
      var setQuery = {};
      if(info.hasOwnProperty("counting")) {
        setQuery['counting'] = info.counting;
        if(stockTakeExists.status) {
          setQuery['status'] = false;
          setQuery['orderedCount'] = stockTakeExists.counting;
        }
      }
      if(info.hasOwnProperty("place")) {
        setQuery['place'] = info.place;
      }

      Stocktakes.update({"_id": id}, {$set: setQuery});
      logger.info("Stocktake updated", stockTakeExists._id);

    } else {
      var stock = Ingredients.findOne(info.stockId);
      if(!stock) {
        logger.error("Stock item does not exist");
        throw new Meteor.Error(403, "Stock item does not exist");
      }
      var generalArea = GeneralAreas.findOne(info.generalArea);
      if(!generalArea) {
        logger.error("General area does not exist");
        throw new Meteor.Error(403, "General area does not exist");
      }
      var specialArea = SpecialAreas.findOne(info.specialArea);
      if(!specialArea) {
        logger.error("Special area does not exist");
        throw new Meteor.Error(403, "Special area does not exist");
      }

      var place = specialArea.stocks.indexOf(info.stockId);
      var doc = {
        "date": new Date(info.date).getTime(),
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
        "orderedCount": 0
      }
      var id = Stocktakes.insert(doc);
      logger.info("New stocktake created", id, place);
    }
    return;
  },

  removeStocktake: function(stocktakeId) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to remove stocktakes");
      throw new Meteor.Error(403, "User not permitted to remove stocktakes");
    }
    var stockItemExists = Stocktakes.findOne(stocktakeId);
    if(!stockItemExists) {
      logger.error('Stock item does not exist in stocktake', {"stockId": stockId, "stocktakeId": stocktakeId});
      throw new Meteor.Error(404, "Stock item does not exist in stocktake");
    }
    if(stockItemExists.status && stockItemExists.orderRef) {
      logger.error("Can't remove stocktake. Order has been placed already");
      throw new Meteor.Error(403, "Can't remove stocktake. Order has been placed already");
    }
    Stocktakes.remove({"_id": stocktakeId});
    logger.info("Stocktake removed", stocktakeId);
  }
});