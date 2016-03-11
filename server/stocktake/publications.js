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
        sort: {"date": -1}
      });
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

Meteor.publish('stocktakeList', function (areaId) {
  return [
    StocktakeMain.find({
      "stocktakeDate": new Date(moment().format("YYYY-MM-DD")).getTime(), // Need to pass moment instance to round unix time
      "relations.areaId": areaId
    }),
    Stocktakes.find({
      'relations.areaId': areaId
    })
  ];
});

Meteor.publish('stocktakeDates', function (areaId, timePeriod) {
  let checkPermission = new HospoHero.security.PermissionChecker(this.userId);
  if (checkPermission.hasPermissionInArea(areaId, "view area reports")) {
    return StocktakeMain.find({
      'relations.areaId': areaId,
      date: {
        $gte: timePeriod
      }
    }, {
      fields: {
        date: 1
      }
    });
  } else {
    this.ready();
  }
});