Meteor.publish('allAreas', function (currentAreaId) {
  if (this.userId) {
    return [
      GeneralAreas.find({'relations.areaId': currentAreaId}),
      SpecialAreas.find({'relations.areaId': currentAreaId})
    ];
  }
});

Meteor.publish('stocktakeMains', function (date) {
  if (this.userId) {
    var query = {
      stocktakeDate: new Date(date).getTime(),
      'relations.areaId': HospoHero.getCurrentAreaId(this.userId)
    };
    return StocktakeMain.find(query);
  }
});

Meteor.publish('stocktakes', function (version) {
  return [
    Stocktakes.find({version: version}),
    StocktakeMain.find(version)
  ];
});

Meteor.publish('ordersPlaced', function (version) {
  logger.info('Stock orders published for version ', version);
  return StockOrders.find({version: version});
});

Meteor.publish("orderReceipts", function (ids) {
  logger.info("Stock order receipts published ", ids);
  return OrderReceipts.find({"_id": {$in: ids}});
});

Meteor.publish('orderReceiptsByVersion', function (version, areaId) {
  logger.info("Stock order receipts published by version", version);
  return OrderReceipts.find({
    version: version,
    'relations.areaId': areaId
  });
});

Meteor.publishComposite('allOrderReceipts', function (areaId) {
  return {
    find: function () {
      return OrderReceipts.find({
        'relations.areaId': areaId
      }, {
        sort: {"date": -1}, limit: 10
      })
    },
    children: [
      {
        find: function (orderReceipt) {
          return Suppliers.find({_id: orderReceipt.supplier});
        }
      },
      {
        find: function (orderReceipt) {
          return StockOrders.find({orderReceipt: orderReceipt._id});
        }
      }
    ]
  };
});

Meteor.publish("receiptOrders", function (receiptId) {
  logger.info("Stock orders published for receipt ", {"ids": receiptId});
  return StockOrders.find({"orderReceipt": receiptId, "countOrdered": {$gt: 0}});
});

Meteor.publish("currentStocks", function (ids) {
  logger.info("Current stocks published ", ids);
  return CurrentStocks.find({"_id": {$in: ids}});
});

Meteor.publish('stocktakeList', function (areaId) {
  return Stocktakes.find({
    'relations.areaId': areaId
  });
});