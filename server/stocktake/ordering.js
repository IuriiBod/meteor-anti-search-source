Meteor.methods({
  generateOrders: function(stockTakeDate) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!stockTakeDate) {
      logger.error("Stocktake date should have a value");
      return new Meteor.Error(404, "Stocktake date should have a value");
    }
    var stocktakes = Stocktakes.find({"date": stockTakeDate}).fetch();
    if(stocktakes.length <= 0) {
      logger.error("No recorded stocktakes found");
      return new Meteor.Error(404, "No recorded stocktakes found");
    }
    stocktakes.forEach(function(stock) {
      if(!stock.status) {
        var stockItem = Ingredients.findOne(stock.stockId);
        if(!stockItem) {
          logger.error("Stock item not found");
          return new Meteor.Error(404, "Stock item not found");
        }

        var count = stock.counting;
        if(stock.hasOwnProperty("orderedCount")) {
          //if count was reduced it will be minus value which will decrement the value
          count = stock.counting - stock.orderedCount;
        }
        var supplier = null;
        if(stockItem && stockItem.hasOwnProperty("suppliers") && stockItem.suppliers.length > 0) {
          supplier = stockItem.suppliers[0];
        }

        var existingOrder = StockOrders.findOne({
          "stockId": stock.stockId,
          "stocktakeDate": stockTakeDate,
          "supplier": supplier
        })
        //generate order
        if(existingOrder) {
          StockOrders.update({"_id": existingOrder._id}, {$inc: {"onhandCount": count}})
        } else {
          var newOrder = {
            "stockId": stock.stockId,
            "stocktakeDate": stockTakeDate,
            "supplier": supplier,
            "onhandCount": count,
            "countNeeded": 0,
            "unit": stockItem.portionOrdered
          }
          var id = StockOrders.insert(newOrder);
          logger.info("New order created", id);
        }

        //update stocktake for order generated count
        Stocktakes.update({"_id": stock._id}, {$set: {"status": true, "orderedCount": stock.counting}})

        //update current stock with count
      }
    });
  },

  editOrderingCount: function(orderId, count) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    var order = StockOrders.findOne(orderId);
    if(!order) {
      logger.error('Stock order not found');
      throw new Meteor.Error(401, "Stock order not found");
    }
    StockOrders.update({"_id": orderId}, {$set: {"countOrdered": parseFloat(count)}});
    logger.info("Stock order count updated", orderId);
  },

  generateReceipts: function(stocktakeDate, supplier, through) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!stocktakeDate) {
      logger.error("Stocktake date should have a value");
      return new Meteor.Error(404, "Stocktake date should have a value");
    }
    if(!supplier) {
      logger.error("Supplier should exist");
      return new Meteor.Error(404, "Supplier should exist");
    }
    if(!through) {
      logger.error("Ordered through should exist");
      return new Meteor.Error(404, "Ordered through should exist");
    }
    var orders = OrdersPlaced.update(
      {"stocktakeDate": stocktakeDate, "supplier": supplier},
      {$set: {"orderedThrough": through, "orderedOn": Date.now()}},
      {$multi: true}
    )
    logger.info("Order receipt generated");
    return;
  }
});