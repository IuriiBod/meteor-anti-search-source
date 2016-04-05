let checkViewStocksPermission = function (userId, areaId) {
  let permissionChecker = userId && new HospoHero.security.PermissionChecker(userId);
  return permissionChecker && permissionChecker.hasPermissionInArea(areaId, 'view stocks');
};

let checkViewStocksPermissionByStocktakeId = function (userId, stocktakeId) {
  let stocktake = Stocktakes.findOne({_id: stocktakeId});
  return checkViewStocksPermission(userId, stocktake.relations.areaId);
};

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
    StockItems.find({stocktakeId: stocktakeId}),
    StockPrepItems.find({stocktakeId: stocktakeId})
  ];
});


Meteor.publishComposite('fullOrderInfo', function (orderId) {
  check(orderId, HospoHero.checkers.OrderId);

  let ordersCursor = Orders.find({_id: orderId});
  let areaId = ordersCursor.fetch()[0].relations.areaId; //it is safe because we checked order's ID

  let permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);
  if (!permissionChecker || !permissionChecker.hasPermissionInArea(areaId, 'receive deliveries')) {
    this.ready();
    return;
  }

  return {
    find: function () {
      return ordersCursor;
    },
    children: [
      {
        find: function (order) {
          return OrderItems.find({orderId: order._id, orderedCount: {$gt: 0}});
        },
        children: [
          {
            find: function (orderItem) {
              return Ingredients.find({_id: orderItem.ingredient.id});
            }
          }
        ]
      },
      {
        find: function (order) {
          return Suppliers.find({_id: order.supplierId});
        }
      }
    ]
  };
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
  };
});


Meteor.publishComposite('allOrdersInArea', function (areaId, isReceived, timeRangeType, limit) {
  check(areaId, HospoHero.checkers.MongoId);
  check(isReceived, Boolean);
  check(timeRangeType, Match.OneOf('week', 'month', 'all'));
  check(limit, HospoHero.checkers.PositiveNumber);

  let permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);

  if (!permissionChecker || !permissionChecker.hasPermissionInArea(areaId, 'receive deliveries')) {
    this.ready();
    return;
  }

  return {
    find: function () {
      let query = {
        'relations.areaId': areaId,
        receivedBy: {$exists: isReceived}
      };

      if (timeRangeType !== 'all') {
        let rangesMap = {
          week: 'forWeek',
          month: 'forMonth'
        };
        let area = Areas.findOne({_id: areaId});
        let methodName = rangesMap[timeRangeType];
        query.createdAt = TimeRangeQueryBuilder[methodName](new Date(), area.locationId);
      }

      return Orders.find(query, {limit: limit});
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