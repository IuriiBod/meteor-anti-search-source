Meteor.methods({
  'createMainStocktake': function(date) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to generate stocktakes");
      throw new Meteor.Error(403, "User not permitted to generate stocktakes");
    }

    HospoHero.checkDate(date);

    var doc = {
      "stocktakeDate": new Date(date).getTime(),
      "date": Date.now(),
      "generalAreas": [],
      "specialAreas": [],
      relations: HospoHero.getRelationsObject()
    };
    var generalAreas = GeneralAreas.find({
      "active": true,
      "relations.areaId": HospoHero.getDefaultArea()
    }).fetch();
    if(generalAreas && generalAreas.length > 0) {
      generalAreas.forEach(function(area) {
        if(doc.generalAreas.indexOf(area._id) < 0) {
          doc['generalAreas'].push(area._id);
        }
      });
    }
    var specialAreas = SpecialAreas.find({
      "active": true,
      "relations.areaId": HospoHero.getDefaultArea()
    }).fetch();
    if(specialAreas && specialAreas.length > 0) {
      specialAreas.forEach(function(area) {
        if(doc.specialAreas.indexOf(area._id) < 0) {
          doc['specialAreas'].push(area._id);
        }
      });
    }
    var id = StocktakeMain.insert(doc);
    logger.info("Creating new stocktake", date, id);
    return id;
  },

  updateStocktake: function(id, info) {

    console.log('ID', id);
    console.log('INFO', info);
    
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to generate stocktakes");
      throw new Meteor.Error(403, "User not permitted to generate stocktakes");
    }

    HospoHero.checkMongoId(id);
    check(info, Object);

    var mainStocktake = StocktakeMain.findOne(info.version);
    if(!mainStocktake) {
      logger.error('Stocktake main does not exist');
      throw new Meteor.Error(401, 'Stocktake main does not exist');
    }

    var stockTakeExists = Stocktakes.findOne(id);
    if(stockTakeExists) {
      var setQuery = {};
      if(info.hasOwnProperty("counting")) {
        var counting = parseFloat(info.counting);
        if(counting != counting) {
          counting = 0;
        }
        setQuery['counting'] = counting;
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

      StocktakeMain.update({"_id": info.version}, {$addToSet: {"generalAreas": info.generalArea, "specialAreas": info.specialArea}});
      logger.info("Stocktake main updated with areas", info.version);
    }
    return id;
  },

  removeStocktake: function(stocktakeId) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to generate stocktakes");
      throw new Meteor.Error(403, "User not permitted to generate stocktakes");
    }

    HospoHero.checkMongoId(stocktakeId);

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
  },

  stocktakePositionUpdate: function(stocktakeId, stockId, sAreaId, info) {
    var newPosition;

    var stocktake = Stocktakes.find(stocktakeId).count();
    //update stocktakes places
    if(stocktake) {
      var nextPosition = 0;
      var prevPosition = 0;

      if(info.hasOwnProperty("nextItemPosition")) {
        nextPosition = info.nextItemPosition;
      }
      if(info.hasOwnProperty("prevItemPosition")) {
        prevPosition = info.prevItemPosition;
      }

      newPosition = (parseFloat(nextPosition) + parseFloat(prevPosition))/2;
      Stocktakes.update({"_id": stocktakeId}, {$set: {"place": newPosition}});
    }

    //update special area original places
    var specialArea = SpecialAreas.findOne(sAreaId);
    if(specialArea) {
      var array = specialArea.stocks;
      var oldPosition = array.indexOf(stockId);

      if(info.hasOwnProperty("nextItemId")) {
        newPosition = (array.indexOf(info.nextItemId) - 1);
      } else if(info.hasOwnProperty("prevItemId")) {
        newPosition = (array.indexOf(info.prevItemId) + 1);
      }

      array.splice(newPosition, 0, array.splice(oldPosition, 1)[0]);
      SpecialAreas.update({"_id": sAreaId}, {$set: {"stocks": array}});
    }
  }
});