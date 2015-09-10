Meteor.publish("allAreas", function() {
  var cursors = [];
  cursors.push(GeneralAreas.find());
  cursors.push(SpecialAreas.find());
  logger.info("All areas published");
  return cursors;
});

Meteor.publish("areaSpecificStocks", function(generalArea) {
  var cursors = [];
  cursors.push(Ingredients.find({"generalAreas": generalArea}));
  logger.info("Ingredients on general area published", generalArea);
  return cursors;
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
  logger.info("Stocktake mains published for date", date);
  var data = StocktakeMain.find({"stocktakeDate": new Date(date).getTime()});
  return data;
});

Meteor.publish("stocktakes", function(version) {
  var cursors = [];
  cursors.push(Stocktakes.find({"version": version}));
  cursors.push(StocktakeMain.find(version));
  logger.info("Stocktakes published for version ", version);
  return cursors;
});

Meteor.publish("ordersPlaced", function(version) {
  logger.info("Stock orders published for version ", version);
  var data = StockOrders.find({"version": version});
  return data;
});

Meteor.publish("orderReceipts", function(ids) {
  logger.info("Stock order receipts published ", ids);
  var data = OrderReceipts.find({"_id": {$in: ids}});
  return data;
});

Meteor.publish("orderReceiptsByVersion", function(version) {
  logger.info("Stock order receipts published by version", version);
  var data = OrderReceipts.find({"version": version});
  return data;
});

Meteor.publish("allOrderReceipts", function() {
  logger.info("Stock order receipts published");
  var data = OrderReceipts.find({}, {sort: {"date": -1}, limit: 10});
  return data;
});

Meteor.publish("receiptOrders", function(receiptId) {
  logger.info("Stock orders published for receipt ", receiptId);
  var data = StockOrders.find({"orderReceipt": receiptId, "countOrdered": {$gt: 0}});
  return data;
});


Meteor.publish("currentStocks", function(ids) {
  logger.info("Current stocks published ", ids);
  var data = CurrentStocks.find({"_id": {$in: ids}});
  return data;
});
