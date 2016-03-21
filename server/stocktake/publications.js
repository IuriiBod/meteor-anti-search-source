let checkViewStocksPermission = function (userId, areaId) {
  let permissionChecker = userId && new HospoHero.security.PermissionChecker(userId);
  return permissionChecker && permissionChecker.hasPermissionInArea(areaId, 'view stocks');
};

let checkViewStocksPermissionByStocktakeId = function (userId, stocktakeId) {
  let stocktake = Stocktakes.findOne({_id: stocktakeId});
  return checkViewStocksPermission(userId, stocktake.relations.areaId);
};

Meteor.publish('allStockAreas', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if (!checkViewStocksPermission(this.userId, areaId)) {
    this.ready();
    return;
  }

  return StockAreas.find({'relations.areaId': areaId});
});


Meteor.publish('fullStocktake', function (stocktakeId) {
  check(stocktakeId, HospoHero.checkers.StocktakeId);

  if (!checkViewStocksPermissionByStocktakeId(this.userId, stocktakeId)) {
    this.ready();
    return;
  }

  return [
    Stocktakes.find({_id: stocktakeId}),
    StockItems.find({stocktakeId: stocktakeId})
  ];
});


Meteor.publish('fullOrderInfo', function (orderId) {
  check(orderId, HospoHero.checkers.OrderId);

  let ordersCursor = Orders.find({_id: orderId});

  let permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);
  let areaId = ordersCursor.fetch()[0].relations.areaId;
  if (!permissionChecker || !permissionChecker.hasPermissionInArea(areaId, 'receive deliveries')) {
    this.ready();
    return;
  }

  return [
    ordersCursor,
    OrderItems.find({orderId: orderId, countOrdered: {$gt: 0}})
  ];
});


Meteor.publishComposite('allStocktakeOrders', function (stocktakeId) {
  check(stocktakeId, HospoHero.checkers.StocktakeId);

  if (!checkViewStocksPermissionByStocktakeId(this.userId, stocktakeId)) {
    this.ready();
    return;
  }
  return {
    find: function () {
      return Orders.find({stocktakeId: stocktakeId});
    },
    children: [
      {
        find: function (order) {
          return OrderItems.find({orderId: order._id});
        }
      }
    ]
  }
});


Meteor.publishComposite('allOrdersInArea', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if (!checkViewStocksPermission(this.userId, areaId)) {
    this.ready();
    return;
  }

  return {
    find: function () {
      return Orders.find({'relations.areaId': areaId});
    },
    children: [
      {
        find: function (order) {
          return Suppliers.find({_id: order.supplierId});
        }
      },
      {
        find: function (order) {
          return OrderItems.find({orderId: order._id});
        }
      }
    ]
  };
});


Meteor.publish('stocktakeList', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if (!checkViewStocksPermission(this.userId, areaId)) {
    this.ready();
    return;
  }

  return [
    Stocktakes.find({
      'relations.areaId': areaId
    })
  ];
});


Meteor.publish('stocktakeDates', function (areaId, timePeriod) {
  check(areaId, HospoHero.checkers.MongoId);
  check(timePeriod, Date);

  let checkPermission = this.userId && new HospoHero.security.PermissionChecker(this.userId);
  if (checkPermission && checkPermission.hasPermissionInArea(areaId, "view area reports")) {
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