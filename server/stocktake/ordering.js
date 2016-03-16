var canUserReceiveDeliveries = function (areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'receive deliveries');
};

var getAreaIdFromOrder = function (orderId) {
  var order = OrderItems.findOne({_id: orderId});
  return (order && order.relations) ? order.relations.areaId : null;
};

Meteor.methods({
  generateOrders: function (stocktakeId) {
    if (!canUserReceiveDeliveries()) {
      logger.error("User not permitted to generate orders");
      throw new Meteor.Error(403, "User not permitted to generate orders");
    }
    if (!stocktakeId) {
      logger.error("Stocktake version should have a value");
      throw new Meteor.Error("Stocktake version should have a value");
    }

    if (!Stocktakes.findOne({_id: stocktakeId})) {
      logger.error("Stocktake version should exist");
      throw new Meteor.Error("Stocktake version should exist");
    }
    var stockItems = StockItems.find({stocktakeId: stocktakeId}).fetch();
    if (stockItems.length === 0) {
      logger.error("No recorded stocktakes found");
      throw new Meteor.Error(404, "No recorded stocktakes found");
    }
    stockItems.forEach(function (stockItem) {
      if (!stockItem.status) {
        var ingredient = stockItem.ingredient;
        var count = stockItem.count;
        var supplier = null;
        if (ingredient && ingredient.hasOwnProperty("suppliers") && ingredient.suppliers) {
          supplier = ingredient.suppliers;
        }

        var existingOrder = OrderItems.findOne({
          stockId: ingredient.stockId,
          version: stocktakeId,
          supplier: supplier
        });
        //generate order
        var orderRef = null;
        if (existingOrder) {
          orderRef = existingOrder._id;
          OrderItems.update({"_id": existingOrder._id}, {$inc: {"countOnHand": count}});
        } else {
          var newOrder = {
            "stockId": ingredient.stockId,
            "version": stocktakeId,
            "supplier": supplier,
            "countOnHand": count,
            "countNeeded": 0,
            "unit": ingredient.portionOrdered,
            "unitPrice": ingredient.costPerPortion,
            "countOrdered": null,
            "orderReceipt": null,
            "received": false,
            relations: HospoHero.getRelationsObject()
          };
          var id = OrderItems.insert(newOrder);
          orderRef = id;
          logger.info("New order created", id);
        }

        //update stocktake for order generated count
        StockItems.update({_id: ingredient._id}, {
          $set: {
            "status": true,
            "orderedCount": ingredient.counting,
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
    var order = OrderItems.findOne(orderId);
    if (!order) {
      logger.error('Stock order not found');
      throw new Meteor.Error(401, "Stock order not found");
    }

    var countToOrder = parseFloat(count);
    countToOrder = !isNaN(countToOrder) ? countToOrder : 0;
    OrderItems.update({"_id": orderId}, {$set: {"countOrdered": countToOrder}});
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
    var order = OrderItems.findOne(id);
    if (!order) {
      logger.error("Order does not exist");
      throw new Meteor.Error("Order does not exist");
    }

    if (OrderReceipts.findOne(order.orderReceipt)) {
      logger.error("You can't delete this order. This has a order receipt");
      throw new Meteor.Error("You can't delete this order. This has a order receipt");
    }
    OrderItems.remove({"_id": id});
    StockItems.update({
        orderId: id
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