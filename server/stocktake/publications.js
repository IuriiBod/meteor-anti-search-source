Meteor.publish('allStockAreas', function (currentAreaId) {
  check(currentAreaId, HospoHero.checkers.MongoId);

  let permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);
  if (permissionChecker && permissionChecker.hasPermissionInArea(currentAreaId, 'view stocks')) {
    this.ready();
    return;
  }
  
  return StockAreas.find({'relations.areaId': currentAreaId});
});
//todo: write all subs in the same fashion as "allStockAreas"

Meteor.publish('stocktakeMains', function (date) {
  if (this.userId) {
    var query = {
      date: new Date(date).getTime(),
      'relations.areaId': HospoHero.getCurrentAreaId(this.userId)
    };
    return Stocktakes.find(query);
  }
});

Meteor.publish('stocktakes', function (stocktakeId) {
  return [
    StockItems.find({stocktakeId: stocktakeId}),
    Stocktakes.find(stocktakeId)
  ];
});

Meteor.publish('ordersPlaced', function (version) {
  logger.info('Stock orders published for version ', version);
  return OrderItems.find({version: version});
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
          return OrderItems.find({orderReceipt: orderReceipt._id});
        }
      }
    ]
  };
});

Meteor.publish("receiptOrders", function (orderId) {
  logger.info("Stock orders published for receipt ", {"ids": orderId});
  return OrderItems.find({"orderReceipt": orderId, countOrdered: {$gt: 0}});
});

Meteor.publish('stocktakeList', function (areaId) {
  return [
    Stocktakes.find({
      date: new Date(moment().format("YYYY-MM-DD")).getTime(), // Need to pass moment instance to round unix time
      'relations.areaId': areaId
    }),
    StockItems.find({
      'relations.areaId': areaId
    })
  ];
});

Meteor.publish('stocktakeDates', function (areaId, timePeriod) {
  let checkPermission = new HospoHero.security.PermissionChecker(this.userId);
  if (checkPermission.hasPermissionInArea(areaId, "view area reports")) {
    return Stocktakes.find({
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