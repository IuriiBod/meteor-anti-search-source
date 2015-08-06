Meteor.publish("allAreas", function() {
  var cursors = [];
  cursors.push(GeneralAreas.find());
  cursors.push(SpecialAreas.find());
  logger.info("All areas published");
  return cursors;
});

Meteor.publish("stocktakesOnDate", function(date) {
  logger.info("Stocktakes published for date ", date);
  var data = Stocktakes.find({"date": new Date(date).getTime()});
  return data;
});


Meteor.publish("ordersPlaced", function(date) {
  logger.info("Stock orders published for date ", date);
  var data = StockOrders.find({"stocktakeDate": new Date(date).getTime()});
  return data;
});

Meteor.publish("orderReceipts", function(stocktakeDate) {
  logger.info("Stock order receipts published for stocktake date ", stocktakeDate);
  var data = OrderReceipts.find({"stocktakeDate": new Date(stocktakeDate).getTime()});
  console.log("....receipts...", data.fetch());
  return data;
});