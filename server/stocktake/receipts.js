Meteor.methods({
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
    } else {
      var date = new Date().toDateString();
      date = new Date(date).getTime();
      var orderedMethod = {
        "through": info.through,
        "details": info.details
      }
      //generating order receipt
      var id = OrderReceipts.insert({
        "date": date,
        "stocktakeDate": stocktakeDate,
        "supplier": supplier,
        "orderedThrough": orderedMethod,
        "expectedDeliveryDate": info.deliveryDate,
        "received": false,
        "receivedDate": null
      });
      logger.info("Order receipt generated", id);
      //update orders
      var orders = StockOrders.update(
        {"stocktakeDate": stocktakeDate, "supplier": supplier},
        {$set: {
          "orderedThrough": orderedMethod, 
          "orderedOn": date,
          "expectedDeliveryDate": info.deliveryDate,
          "received": false,
          "receivedDate": null,
          "orderReceipt": id
        }},
        {multi: true}
      );
      logger.info("Orders updated", {"stocktakeDate": stocktakeDate, "supplier": supplier});
    }

    if(info.through == "emailed") {
      //send email to supplier
    }
    return;
  }
});