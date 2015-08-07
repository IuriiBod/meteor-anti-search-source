Meteor.methods({
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
    var specialAreas = SpecialAreas.find().fetch();
    
    if(specialAreas.length > 0) {
      specialAreas.forEach(function(area) {
        if(area && area.stocks.length > 0) {
          area.stocks.forEach(function(id) {
            var existingStocktake = Stocktakes.findOne({
              "date": new Date(stocktakeDate).getTime,
              "generalArea": area.generalArea,
              "specialArea": area._id,
              "stockId": id
            });
            if(!existingStocktake) {
              var ingredient = Ingredients.findOne(id);
              if(ingredient) {
                var place = area.stocks.indexOf(id);
                var doc = {
                  "date": new Date(stocktakeDate).getTime(),
                  "generalArea": area.generalArea,
                  "specialArea": area._id,
                  "stockId": id,
                  "counting": 0,
                  "createdAt": Date.now(),
                  "place": place,
                  "costPerPortion": ingredient.costPerPortion
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

  'updateStocktake': function(info) {
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

    var stockTakeExists = Stocktakes.findOne({
      "date": new Date(info.date).getTime(),
      "generalArea": info.generalArea,
      "specialArea": info.specialArea,
      "stockId": info.stockId
    });
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

      Stocktakes.update({
        "date": new Date(info.date).getTime(),
        "generalArea": info.generalArea,
        "specialArea": info.specialArea,
        "stockId": info.stockId
        }, {$set: setQuery}
      );
      logger.info("Stocktake updated", stockTakeExists._id);

    } else {
      var place = specialArea.stocks.indexOf(info.stockId);
      var doc = {
        "date": new Date(info.date).getTime(),
        "generalArea": info.generalArea,
        "specialArea": info.specialArea,
        "stockId": info.stockId,
        "counting": info.counting,
        "createdAt": Date.now(),
        "place": place,
        "costPerPortion": stock.costPerPortion
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
    Stocktakes.remove({"_id": stocktakeId});
    logger.info("Stocktake removed", stocktakeId);
  }
});