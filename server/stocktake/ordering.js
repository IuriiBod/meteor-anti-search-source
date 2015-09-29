Meteor.methods({
  generateOrders: function(stocktakeVersion) {

    console.log('StockVersion', stocktakeVersion);

    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to generate orders");
      throw new Meteor.Error(404, "User not permitted to generate orders");
    }

    if(!stocktakeVersion) {
      logger.error("Stocktake version should have a value");
      throw new Meteor.Error(404, "Stocktake version should have a value");
    }

    var version = StocktakeMain.findOne(stocktakeVersion);
    if(!version) {
      logger.error("Stocktake version should exist");
      throw new Meteor.Error(404, "Stocktake version should exist")
    }
    var stocktakes = Stocktakes.find({"version": stocktakeVersion}).fetch();
    if(stocktakes.length <= 0) {
      logger.error("No recorded stocktakes found");
      throw new Meteor.Error(404, "No recorded stocktakes found");
    }
    stocktakes.forEach(function(stock) {
      if(!stock.status) {
        var stockItem = Ingredients.findOne(stock.stockId);
        if(!stockItem) {
          logger.error("Stock item not found");
          throw new Meteor.Error(404, "Stock item not found");
        }

        var count = stock.counting;
        if(stock.hasOwnProperty("orderedCount")) {
          //if count was reduced it will be minus value which will decrement the value
          count = stock.counting - stock.orderedCount;
        }
        var supplier = null;
        if(stockItem && stockItem.hasOwnProperty("suppliers") && stockItem.suppliers) {
          supplier = stockItem.suppliers;
        }

        var existingOrder = StockOrders.findOne({
          "stockId": stock.stockId,
          "version": stocktakeVersion,
          "supplier": supplier
        });
        //generate order
        var orderRef = null;
        if(existingOrder) {
          orderRef = existingOrder._id;
          StockOrders.update({"_id": existingOrder._id}, {$inc: {"countOnHand": count}})
        } else {
          var newOrder = {
            "stockId": stock.stockId,
            "version": stocktakeVersion,
            "supplier": supplier,
            "countOnHand": count,
            "countNeeded": 0,
            "unit": stockItem.portionOrdered,
            "unitPrice": stockItem.costPerPortion,
            "countOrdered": 0,
            "orderReceipt": null,
            "received": false,
            relations: HospoHero.getRelationsObject()
          };
          orderRef = StockOrders.insert(newOrder);
          logger.info("New order created", id);
        }

        //update stocktake for order generated count
        Stocktakes.update({"_id": stock._id}, { 
          $set: {
            "status": true, 
            "orderedCount": stock.counting,
            "orderRef": orderRef
          }
        });
      }
    });
  },

  editOrderingCount: function(orderId, count) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to edit ordering count");
      throw new Meteor.Error(404, "User not permitted to edit ordering count");
    }

    var order = StockOrders.findOne(orderId);
    if(!order) {
      logger.error('Stock order not found');
      throw new Meteor.Error(401, "Stock order not found");
    }
    StockOrders.update({"_id": orderId}, {$set: {"countOrdered": parseFloat(count)}});
    logger.info("Stock order count updated", orderId);
  },

  removeOrder: function(id) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to remove placed orders");
      throw new Meteor.Error(404, "User not permitted to remove placed orders");
    }

    HospoHero.checkMongoId(id);

    var order = StockOrders.findOne(id);
    if(!order) {
      logger.error("Order does not exist");
      throw new Meteor.Error(401, "Order does not exist");
    }
    var receipt = OrderReceipts.findOne(order.orderReceipt);
    if(receipt) {
      logger.error("You can't delete this order. This has a order receipt");
      throw new Meteor.Error(401, "You can't delete this order. This has a order receipt");
    }
    StockOrders.remove({"_id": id});
    Stocktakes.update(
      {"orderRef": id},
      {$set: {
        "status": false,
        "orderedCount": 0,
        "orderRef": null
      }},
      {multi: true}
    );
    logger.info("Stock order removed");
  }
});