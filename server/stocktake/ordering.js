Meteor.methods({
  generateOrders: function(stockTakeDate) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to generate orders");
      throw new Meteor.Error(404, "User not permitted to generate orders");
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
        var orderRef = null;
        if(existingOrder) {
          orderRef = existingOrder._id;
          StockOrders.update({"_id": existingOrder._id}, {$inc: {"onhandCount": count}})
        } else {
          var newOrder = {
            "stockId": stock.stockId,
            "stocktakeDate": stockTakeDate,
            "supplier": supplier,
            "onhandCount": count,
            "countNeeded": 0,
            "unit": stockItem.portionOrdered,
            "unitPrice": stockItem.costPerPortion
          }
          var id = StockOrders.insert(newOrder);
          orderRef = id;
          logger.info("New order created", id);
        }

        //update stocktake for order generated count
        Stocktakes.update({"_id": stock._id}, { 
          $set: {
            "status": true, 
            "orderedCount": stock.counting
          },
          $addToSet: {
            "orderRef": orderRef
          }
        });

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

  generateReceipts: function(stocktakeDate, supplier, info) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to generate receipts");
      throw new Meteor.Error(404, "User not permitted to generate receipts");
    }
    if(!stocktakeDate) {
      logger.error("Stocktake date should have a value");
      return new Meteor.Error(404, "Stocktake date should have a value");
    }
    if(!supplier) {
      logger.error("Supplier should exist");
      return new Meteor.Error(404, "Supplier should exist");
    }
    if(!info.through) {
      logger.error("Ordered method should exist");
      return new Meteor.Error(404, "Ordered method should exist");
    }
    var ordersExist = StockOrders.find({"stocktakeDate": stocktakeDate, "supplier": supplier}).fetch();
    if(ordersExist.length < 0) {
      logger.error("Orders does not exist");
      return new Meteor.Error(404, "Orders does not exist");
    }
    var ordersReceiptExist = OrderReceipts.findOne({"stocktakeDate": stocktakeDate, "supplier": supplier});
    if(ordersReceiptExist) {
      logger.error("Orders receipt exists");
      return new Meteor.Error(404, "Orders receipt exists");
    }
    var orderedMethod = {
      "through": info.through,
      "details": info.details
    }
    var orders = StockOrders.update(
      {"stocktakeDate": stocktakeDate, "supplier": supplier},
      {$set: {
        "orderedThrough": orderedMethod, 
        "orderedOn": Date.now(),
        "expectedDeliveryDate": info.deliveryDate
      }},
      {multi: true}
    );
    logger.info("Orders updated", {"stocktakeDate": stocktakeDate, "supplier": supplier});
    //generating order receipt
    var orderIds = [];
    ordersExist.forEach(function(order) {
      if(orderIds.indexOf(order._id) < 0) {
        orderIds.push(order._id);
      }
    });
    OrderReceipts.insert({
      "date": Date.now(),
      "stocktakeDate": stocktakeDate,
      "supplier": supplier,
      "orderedThrough": orderedMethod,
      "orders": orderIds,
      "expectedDeliveryDate": info.deliveryDate
    });

    if(info.through == "emailed") {
      //send email to supplier
    }
    logger.info("Order receipt generated");
    return;
  },

  'removeOrder': function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to remove placed orders");
      throw new Meteor.Error(404, "User not permitted to remove placed orders");
    }
    if(!id) {
      logger.error('Stock order id not found');
      throw new Meteor.Error(401, 'Stock order id not found');
    }
    var order = StockOrders.findOne(id);
    if(!order) {
      logger.error("Order does not exist");
      throw new Meteor.Error(401, "Order does not exist");
    }
    var receipt = OrderReceipts.findOne({"orders": id});
    if(receipt) {
      logger.error("You can't delete this order. This has a order receipt");
      throw new Meteor.Error(401, "You can't delete this order. This has a order receipt");
    }
    StockOrders.remove({"_id": id});
    // Stocktakes.update({"order": {$in: }})
    logger.info("Stock order removed");
    return;
  }
});