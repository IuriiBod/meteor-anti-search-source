Meteor.publish("allAreas", function() {
  if(this.userId) {
    return [
      GeneralAreas.find({ "relations.areaId": HospoHero.currentArea() }),
      SpecialAreas.find({ "relations.areaId": HospoHero.currentArea() })
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
      "stocktakeDate": new Date(date).getTime(),
      "relations.areaId": HospoHero.currentArea()
    };
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
    return OrderReceipts.find({ "relations.areaId": HospoHero.currentArea() }, {sort: {"date": -1}, limit: 10});
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
