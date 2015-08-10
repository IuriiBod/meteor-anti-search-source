Meteor.methods({
  generateReceipts: function(version, supplier, info) {
    console.log(".......", arguments);
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
    if(!version) {
      logger.error("Stocktake version should have a value");
      throw new Meteor.Error(404, "Stocktake version should have a value");
    }
    var stocktakeMain = StocktakeMain.findOne(version);
    if(!stocktakeMain) {
      logger.error("Stocktake main should exist");
      throw new Meteor.Error(404, "Stocktake main should exist");
    }
    if(!supplier) {
      logger.error("Supplier should exist");
      throw new Meteor.Error(404, "Supplier should exist");
    }
    if(!info.through) {
      logger.error("Ordered method should exist");
      throw new Meteor.Error(404, "Ordered method should exist");
    }
    var ordersExist = StockOrders.find({"version": version, "supplier": supplier}).fetch();
    if(ordersExist.length < 0) {
      logger.error("Orders does not exist");
      throw new Meteor.Error(404, "Orders does not exist");
    }
    var ordersReceiptExist = OrderReceipts.findOne({"stocktakeDate": stocktakeMain.stocktakeDate, "supplier": supplier});
    if(ordersReceiptExist && !ordersReceiptExist.received) {
      logger.error("Undelivered orders receipt exists");
      throw new Meteor.Error(404, "Undelivered orders receipt exists");
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
        "version": version,
        "stocktakeDate": stocktakeMain.stocktakeDate,
        "supplier": supplier,
        "orderedThrough": orderedMethod,
        "orderPlacedBy": Meteor.userId(),
        "expectedDeliveryDate": info.deliveryDate,
        "received": false,
        "receivedDate": null,
        "invoiceFaceValue": 0
      });
      logger.info("Order receipt generated", id);
      //update orders
      var orders = StockOrders.update(
        {"version": version, "supplier": supplier},
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
      logger.info("Orders updated", {"stocktakeDate": stocktakeMain.stocktakeDate, "supplier": supplier});
    }

    if(info.through == "emailed") {
      //send email to supplier
    }
    return;
  }
});