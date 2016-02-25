Meteor.methods({
  receiveDelivery: function (receiptId) {
    if (!HospoHero.canUser('receive deliveries', Meteor.userId())) {
      logger.error("User not permitted to receive delivery");
      throw new Meteor.Error(403, "User not permitted to receive delivery");
    }
    if (!receiptId) {
      logger.error("Receipt id not found");
      throw new Meteor.Error(401, "Receipt id not found");
    }

    if (!OrderReceipts.findOne(receiptId)) {
      logger.error("Receipt  not found");
      throw new Meteor.Error("Receipt  not found");
    }
    OrderReceipts.update(
      {"_id": receiptId},
      {
        $set: {
          "received": true,
          "receivedDate": Date.now(),
          "receivedBy": Meteor.userId()
        }
      }
    );
    logger.info("Order receipt marked as received", receiptId);
  },

  updateOrderItems: function (id, receiptId, status, info) {
    if (!HospoHero.canUser('receive deliveries', Meteor.userId())) {
      logger.error("User not permitted to update oreder items");
      throw new Meteor.Error(403, "User not permitted to update oreder items");
    }
    if (!id) {
      logger.error("Id not found");
      throw new Meteor.Error(401, "Id not found");
    }
    if (!receiptId) {
      logger.error("Receipt id not found");
      throw new Meteor.Error(401, "Receipt id not found");
    }
    if (!status) {
      logger.error("Status not found");
      throw new Meteor.Error(401, "Status not found");
    }
    var order = StockOrders.findOne(id);
    if (!order) {
      logger.error("Order not found");
      throw new Meteor.Error(401, "Order not found");
    }

    var query = {};
    var setQuery = {};

    if (status == "Wrong Price") {
      if (!info.price) {
        logger.error("Price not found");
        throw new Meteor.Error(401, "Price not found");
      }
      setQuery['unitPrice'] = info.price;
      if (!order.originalPrice) {
        setQuery['originalPrice'] = order.unitPrice;
      }
      setQuery['priceUpdatedBy'] = Meteor.userId();
      setQuery['stockPriceUpdated'] = info.stockPriceUpdated;
    } else if (status == "Wrong Quantity") {
      if (info.quantity < 0) {
        logger.error("Quantity not found");
        throw new Meteor.Error(401, "Quantity not found");
      }
      setQuery['countDelivered'] = info.quantity;
      setQuery['countDeliveredUpdatedBy'] = Meteor.userId();
    }
    if (Object.keys(setQuery).length > 0) {
      query['$set'] = setQuery;
    }

    StockOrders.update({"_id": id, "orderReceipt": receiptId}, query);

    order = StockOrders.findOne(id);
    var newStatus = [];
    if (order.unitPrice === order.originalPrice && order.countDelivered === order.countOrdered) {
      newStatus.push('Delivered Correctly');
    } else {
      if (order.unitPrice !== order.originalPrice) {
        newStatus.push('Wrong Price');
      }
      if (order.countDelivered !== order.countOrdered) {
        newStatus.push('Wrong Quantity');
      }
    }
    StockOrders.update({"_id": id, "orderReceipt": receiptId}, {
      $set: {deliveryStatus: newStatus}
    });

    logger.info("Stock order updated", id, status);
  },

  receiveOrderItems: function (id, receiptId, info) {
    if (!HospoHero.canUser('receive deliveries', Meteor.userId())) {
      logger.error("User not permitted to receive oreder items");
      throw new Meteor.Error(403, "User not permitted to receive oreder items");
    }
    if (!id) {
      logger.error("Id not found");
      throw new Meteor.Error(401, "Id not found");
    }
    if (!receiptId) {
      logger.error("Receipt id not found");
      throw new Meteor.Error(401, "Receipt id not found");
    }
    var order = StockOrders.findOne(id);
    if (!order) {
      logger.error("Order not found");
      throw new Meteor.Error(401, "Order not found");
    }
    var updateQuery = {
      "received": info.received,
      "receivedBy": Meteor.userId(),
      "receivedDate": Date.now()
    };
    if (!order.deliveryStatus || order.deliveryStatus.length < 0) {
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