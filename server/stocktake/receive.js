Meteor.methods({
  receiveDelivery: function (receiptId) {
    if (!HospoHero.canUser('edit stocks')()) {
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


    var orders = StockOrders.find({"orderReceipt": receiptId}).fetch();
    if(orders && orders.length > 0) {
      orders.forEach(function(order) {
        var note = "Order receive on receipt " + receiptId;
        var quantity = order.countOrdered;
        if(order.hasOwnProperty("countDelivered")) {
          quantity = order.countDelivered;
        }
        var date = moment(date).format("YYYY-MM-DD");
        Meteor.call("updateCurrentStock", order.stockId, note, quantity, date);

      });
    }
  },

  updateOrderItems: function (id, receiptId, status, info) {
    if (!HospoHero.canUser('edit stocks')()) {
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
    if (order.deliveryStatus && order.deliveryStatus.indexOf("Delivered Correctly") >= 0) {
      StockOrders.update({"_id": id, "orderReceipt": receiptId}, {$pull: {"deliveryStatus": "Delivered Correctly"}});
    }

    var query = {
      $addToSet: {"deliveryStatus": status}
    };
    var setQuery = {};

    if (status == "Wrong Price") {
      if (!info.price) {
        logger.error("Price not found");
        throw new Meteor.Error(401, "Price not found");
      }
      if (order.unitPrice != info.price) {
        setQuery['unitPrice'] = info.price;
        setQuery['originalPrice'] = order.unitPrice;
        setQuery['priceUpdatedBy'] = Meteor.userId();
        setQuery['stockPriceUpdated'] = info.stockPriceUpdated;
      }
    } else if (status == "Wrong Quantity") {
      if (!info.quantity) {
        logger.error("Quantity not found");
        throw new Meteor.Error(401, "Quantity not found");
      }
      if (order.countOrdered != info.quantity) {
        setQuery['countDelivered'] = info.quantity;
        setQuery['countDeliveredUpdatedBy'] = Meteor.userId();
      }
    }
    if (Object.keys(setQuery).length > 0) {
      query['$set'] = setQuery;
    }
    StockOrders.update({"_id": id, "orderReceipt": receiptId}, query);
    logger.info("Stock order updated", id, status);

    Meteor.call("updateCurrentStock", order.stockId, "Stock receive", order.countOrdered, new Date());
  },

  receiveOrderItems: function (id, receiptId, info) {
    if (!HospoHero.canUser('edit stocks')()) {
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