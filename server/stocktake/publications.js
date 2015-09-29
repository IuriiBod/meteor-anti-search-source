Meteor.publish("allAreas", function() {
  if(this.userId) {
    var query = {};
    var user = Meteor.users.findOne({_id: this.userId});
    if(user.defaultArea) {
      query["relations.areaId"] = user.defaultArea;
    }
    return [
      GeneralAreas.find(query),
      SpecialAreas.find(query)
    ];
  }
});

Meteor.publish("areaSpecificStocks", function(generalArea) {
  return Ingredients.find({"generalAreas": generalArea});
});

Meteor.publish("areaSpecificStockTakes", function(generalArea) {
  var cursors = [];
  var stocktakes = Stocktakes.find({"generalArea": generalArea});
  cursors.push(stocktakes);
  var ids = [];
  stocktakes.fetch().forEach(function(item) {
    if(ids.indexOf(item._id) < 0) {
      ids.push(item.stockId);
    }
  });
  if(ids.length > 0) {
    cursors.push(Ingredients.find({"_id": {$in: ids}}));
  }
  logger.info("Stocktakes on general area published", generalArea);
  return cursors;
});

Meteor.publish("stocktakeMains", function(date) {
  if(this.userId) {
    var query = {
      "stocktakeDate": new Date(date).getTime()
    };
    var user = Meteor.users.findOne({_id: this.userId});
    if(user.defaultArea) {
      query["relations.areaId"] = user.defaultArea;
    }
    return StocktakeMain.find(query);
  }
});

Meteor.publish("stocktakes", function(version) {
  return [
    Stocktakes.find({"version": version}),
    StocktakeMain.find(version)
  ];
});

Meteor.publish("ordersPlaced", function(version) {
  logger.info("Stock orders published for version ", version);
  return StockOrders.find({"version": version});
});

Meteor.publish("orderReceipts", function(ids) {
  logger.info("Stock order receipts published ", ids);
  return OrderReceipts.find({"_id": {$in: ids}});
});

Meteor.publish("orderReceiptsByVersion", function(version) {
  logger.info("Stock order receipts published by version", version);
  return OrderReceipts.find({"version": version});
});

Meteor.publish("allOrderReceipts", function() {
  if(this.userId) {
    var query = {};
    var user = Meteor.users.findOne({_id: this.userId});
    if(user.defaultArea) {
      query["relations.areaId"] = user.defaultArea;
    }

    return OrderReceipts.find(query, {sort: {"date": -1}, limit: 10});
  }
});

Meteor.publish("receiptOrders", function(receiptId) {
  logger.info("Stock orders published for receipt ", receiptId);
  return StockOrders.find({"orderReceipt": receiptId, "countOrdered": {$gt: 0}});
});


Meteor.publish("currentStocks", function(ids) {
  logger.info("Current stocks published ", ids);
  return CurrentStocks.find({"_id": {$in: ids}});
});
