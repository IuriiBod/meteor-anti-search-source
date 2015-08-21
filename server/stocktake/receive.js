Meteor.methods({
  receiveDelivery: function(receiptId) {
    if(!receiptId) {
      logger.error("Receipt id not found");
      throw new Meteor.Error(401, "Receipt id not found");
    }
    var receipt = OrderReceipts.findOne(receiptId);
    if(!receipt) {
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

    StockOrders.update({"orderReceipt": receiptId}, {$set: {"received": true}}, {multi: true});
    logger.info("Stock orders marked received", {"receipt": receiptId});
    return;
  },

  updateOrderItems: function(id, receiptId, status, info) {
    if(!id) {
      logger.error("Id not found");
      throw new Meteor.Error(401, "Id not found");
    }
    if(!receiptId) {
      logger.error("Receipt id not found");
      throw new Meteor.Error(401, "Receipt id not found");
    }
    if(!status) {
      logger.error("Status not found");
      throw new Meteor.Error(401, "Status not found");
    }
    var order = StockOrders.findOne(id);
    if(!order) {
      logger.error("Order not found");
      throw new Meteor.Error(401, "Order not found");
    }
    var updateQuery = {};

    if(status == "Wrong Price") {
      if(!info.price) {
        logger.error("Price not found");
        throw new Meteor.Error(401, "Price not found");
      }
      if(order.unitPrice != info.price) {
        updateQuery['unitPrice'] = info.price;
        updateQuery['originalPrice'] = order.unitPrice;
        updateQuery['priceUpdatedBy'] = Meteor.userId();
        updateQuery['stockPriceUpdated'] = info.stockPriceUpdated;
      }
    } else if(status == "Wrong Quantity") {
      if(!info.quantity) {
        logger.error("Quantity not found");
        throw new Meteor.Error(401, "Quantity not found");
      }
      if(order.countOrdered != info.quantity) {
        updateQuery['countDelivered'] = info.quantity;
        updateQuery['countDeliveredUpdatedBy'] = Meteor.userId();
      } 
    }
    StockOrders.update(
      {"_id": id, "orderReceipt": receiptId},
      {$set: updateQuery, $addToSet: {"deliveryStatus": status}}
    );
    logger.info("Stock order updated", id, status);
    return;
  },

  receiveOrderItems: function(id, receiptId, info) {
     if(!id) {
      logger.error("Id not found");
      throw new Meteor.Error(401, "Id not found");
    }
    if(!receiptId) {
      logger.error("Receipt id not found");
      throw new Meteor.Error(401, "Receipt id not found");
    }
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
    StockOrders.update(
      {"_id": id, "orderReceipt": receiptId},
      {$set: updateQuery}
    );
    logger.info("Stock order received", id);
    return;
  },

  receiptUpdate: function(id, info) {
    if(!id) {
      logger.error("Id not found");
      throw new Meteor.Error(401, "Id not found");
    }
    var receipt = OrderReceipts.findOne(id);
    if(!receipt) {
      logger.error("Receipt not found");
      throw new Meteor.Error(401, "Receipt not found");
    }
    var updateQuery = {};
    if(info.hasOwnProperty("invoiceFaceValue")) {
      updateQuery['invoiceFaceValue'] = info.invoiceFaceValue;
    }
    OrderReceipts.update({"_id": id}, {$set: updateQuery});
    logger.info("Update receipt", info);
    return;
  } 
});