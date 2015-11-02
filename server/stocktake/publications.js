Meteor.publish("allAreas", function () {
  if (this.userId) {
    return [
      GeneralAreas.find({"relations.areaId": HospoHero.getCurrentAreaId(this.userId)}),
      SpecialAreas.find({"relations.areaId": HospoHero.getCurrentAreaId(this.userId)})
    ];
  }
});

Meteor.publish("stocktakeMains", function (date) {
  if (this.userId) {
    var query = {
      "stocktakeDate": new Date(date).getTime(),
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };
    return StocktakeMain.find(query);
  }
});

Meteor.publish("stocktakes", function (version) {
  return [
    Stocktakes.find({"version": version}),
    StocktakeMain.find(version)
  ];
});

Meteor.publish("ordersPlaced", function (version) {
  logger.info("Stock orders published for version ", version);
  return StockOrders.find({"version": version});
});

Meteor.publish("orderReceipts", function (ids) {
  logger.info("Stock order receipts published ", ids);
  return OrderReceipts.find({"_id": {$in: ids}});
});

Meteor.publish("orderReceiptsByVersion", function (version) {
  logger.info("Stock order receipts published by version", version);
  return OrderReceipts.find({
    "version": version,
    "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
  });
});

Meteor.publishAuthorized("allOrderReceipts", function () {
  return OrderReceipts.find({
    "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
  }, {
    sort: {"date": -1}, limit: 10
  });
});

Meteor.publish("receiptOrders", function (receiptId) {
  logger.info("Stock orders published for receipt ", {"ids": receiptId});
  return StockOrders.find({"orderReceipt": receiptId, "countOrdered": {$gt: 0}});
});

Meteor.publish("currentStocks", function (ids) {
  logger.info("Current stocks published ", ids);
  return CurrentStocks.find({"_id": {$in: ids}});
});