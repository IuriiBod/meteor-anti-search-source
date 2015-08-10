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
        "receivedDate": Date.now()
      }}
    );
  },

  receiveReceiptItems: function(id, receiptId, status, info) {
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
    var updateQuery = {
      "received": true,
      "deliveryStatus": status
    };

    if(status == "wrongPrice") {
      if(!info.price) {
        logger.error("Price not found");
        throw new Meteor.Error(401, "Price not found");
      }
      updateQuery['deliveredPrice'] = info.price;
    } else if(status == "wrongQuantity") {
      if(!info.quantity) {
        logger.error("Quantity not found");
        throw new Meteor.Error(401, "Quantity not found");
      }
      updateQuery['countDelivered'] = info.quantity;
    }
    StockOrders.update({"_id": id}, {$set: updateQuery});
    logger.info("Stock order updated", id, status);
    return;
  }
});