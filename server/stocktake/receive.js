Meteor.methods({
  receiveDelivery: function(receiptId) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to view receive delivery");
      throw new Meteor.Error(403, "User not permitted to view receive delivery");
    }

    HospoHero.checkMongoId(receiptId);

    if(!OrderReceipts.findOne(receiptId)) {
      logger.error("Receipt  not found");
      throw new Meteor.Error(404, "Receipt  not found");
    }
    OrderReceipts.update(
      {"_id": receiptId},
      {$set: {
        "received": true,
        "receivedDate": Date.now(),
        "receivedBy": Meteor.userId()
      }}
    );
    logger.info("Order receipt marked as received", receiptId);
  },

  updateOrderItems: function(id, receiptId, status, info) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to view receive delivery");
      throw new Meteor.Error(403, "User not permitted to view receive delivery");
    }

    HospoHero.checkMongoId(id);
    HospoHero.checkMongoId(receiptId);

    if(!status) {
      logger.error("Status not found");
      throw new Meteor.Error("Status not found");
    }

    var order = StockOrders.findOne(id);
    if(!order) {
      logger.error("Order not found");
      throw new Meteor.Error("Order not found");
    }
    if(order.deliveryStatus && order.deliveryStatus.indexOf("Delivered Correctly") >= 0) {
      StockOrders.update({"_id": id, "orderReceipt": receiptId}, {$pull: {"deliveryStatus": "Delivered Correctly"}});
    }

    var query = {
      $addToSet: {"deliveryStatus": status}
    };
    var setQuery = {};

    if(status == "Wrong Price") {
      if(!info.price) {
        logger.error("Price not found");
        throw new Meteor.Error(401, "Price not found");
      }
      if(order.unitPrice != info.price) {
        setQuery['unitPrice'] = info.price;
        setQuery['originalPrice'] = order.unitPrice;
        setQuery['priceUpdatedBy'] = Meteor.userId();
        setQuery['stockPriceUpdated'] = info.stockPriceUpdated;
      }
    } else if(status == "Wrong Quantity") {
      if(!info.quantity) {
        logger.error("Quantity not found");
        throw new Meteor.Error(401, "Quantity not found");
      }
      if(order.countOrdered != info.quantity) {
        setQuery['countDelivered'] = info.quantity;
        setQuery['countDeliveredUpdatedBy'] = Meteor.userId();
      } 
    } 
    if(Object.keys(setQuery).length > 0) {
      query['$set'] = setQuery;
    }
    StockOrders.update({"_id": id, "orderReceipt": receiptId}, query);
    logger.info("Stock order updated", id, status);
  },

  receiveOrderItems: function(id, receiptId, info) {
    if(!HospoHero.perms.canEditStock()) {
      logger.error("User not permitted to view receive delivery");
      throw new Meteor.Error(403, "User not permitted to view receive delivery");
    }

    HospoHero.checkMongoId(id);
    HospoHero.checkMongoId(receiptId);

    var order = StockOrders.findOne(id);
    if(!order) {
      logger.error("Order not found");
      throw new Meteor.Error(401, "Order not found");
    }
    var updateQuery = {
      "received": info.received,
      "receivedBy": Meteor.userId(),
      "receivedDate": Date.now()
    };
    if(!order.deliveryStatus || order.deliveryStatus.length < 0) {
      updateQuery['deliveryStatus'] = ['Delivered Correctly'];
      updateQuery["receivedBy"] = Meteor.userId();
      updateQuery["receivedDate"] = Date.now();
    }

    StockOrders.update(
      {"_id": id, "orderReceipt": receiptId},
      {$set: updateQuery}
    );
    logger.info("Stock order received", id);
  }
});