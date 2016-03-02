var canUserReceiveDeliveries = function(areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'receive deliveries');
};

var getAreaIdFromOrder = function(orderId) {
  var order = StockOrders.findOne({_id: orderId});
  return (order && order.relations) ? order.relations.areaId : null;
};

Meteor.methods({
  generateOrders: function (stocktakeVersion) {
    if (!canUserReceiveDeliveries()) {
      logger.error("User not permitted to generate orders");
      throw new Meteor.Error(403, "User not permitted to generate orders");
    }
    if (!stocktakeVersion) {
      logger.error("Stocktake version should have a value");
      throw new Meteor.Error("Stocktake version should have a value");
    }

    if (!StocktakeMain.findOne(stocktakeVersion)) {
      logger.error("Stocktake version should exist");
      throw new Meteor.Error("Stocktake version should exist")
    }
    var stocktakes = Stocktakes.find({"version": stocktakeVersion}).fetch();
    if (stocktakes.length == 0) {
      logger.error("No recorded stocktakes found");
      throw new Meteor.Error(404, "No recorded stocktakes found");
    }
    stocktakes.forEach(function (stock) {
      if (!stock.status) {
        var stockItem = Ingredients.findOne(stock.stockId);
        if (!stockItem) {
          logger.error("Stock item not found");
          throw new Meteor.Error(404, "Stock item not found");
        }

        var count = stock.counting;
        if (stock.hasOwnProperty("orderedCount")) {
          //if count was reduced it will be minus value which will decrement the value
          count = stock.counting - stock.orderedCount;
        }
        var supplier = null;
        if (stockItem && stockItem.hasOwnProperty("suppliers") && stockItem.suppliers) {
          supplier = stockItem.suppliers;
        }

        var existingOrder = StockOrders.findOne({
          "stockId": stock.stockId,
          "version": stocktakeVersion,
          "supplier": supplier
        });
        //generate order
        var orderRef = null;
        if (existingOrder) {
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
            "countOrdered": null,
            "orderReceipt": null,
            "received": false,
            relations: HospoHero.getRelationsObject()
          };
          var id = StockOrders.insert(newOrder);
          orderRef = id;
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
        //update current stock with count
      }
    });
  },

  editOrderingCount: function (orderId, count) {
    if (!canUserReceiveDeliveries(getAreaIdFromOrder(orderId))) {
      logger.error("User not permitted to edit ordering count");
      throw new Meteor.Error(404, "User not permitted to edit ordering count");
    }
    var order = StockOrders.findOne(orderId);
    if (!order) {
      logger.error('Stock order not found');
      throw new Meteor.Error(401, "Stock order not found");
    }

    var countToOrder = parseFloat(count);
    countToOrder = !isNaN(countToOrder) ? countToOrder : 0;
    StockOrders.update({"_id": orderId}, {$set: {"countOrdered": countToOrder}});
    logger.info("Stock order count updated", orderId);
  },

  'removeOrder': function (id) {
    if (!canUserReceiveDeliveries(getAreaIdFromOrder(id))) {
      logger.error("User not permitted to remove placed orders");
      throw new Meteor.Error(403, "User not permitted to remove placed orders");
    }
    if (!id) {
      logger.error('Stock order id not found');
      throw new Meteor.Error('Stock order id not found');
    }
    var order = StockOrders.findOne(id);
    if (!order) {
      logger.error("Order does not exist");
      throw new Meteor.Error("Order does not exist");
    }

    if (OrderReceipts.findOne(order.orderReceipt)) {
      logger.error("You can't delete this order. This has a order receipt");
      throw new Meteor.Error("You can't delete this order. This has a order receipt");
    }
    StockOrders.remove({"_id": id});
    Stocktakes.update({
        "orderRef": id
      }, {
        $set: {
          "status": false,
          "orderedCount": 0,
          "orderRef": null
        }
      },
      {multi: true}
    );
    logger.info("Stock order removed");
  }
});