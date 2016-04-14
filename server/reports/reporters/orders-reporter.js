class OrdersReporter {
  /**
   * @param {array} stocktakeIds Mongo IDs
   * @param {string} areaId Mongo ID
   */
  constructor(stocktakeIds, areaId) {
    this._stocktakeIds = stocktakeIds;
    this._areaId = areaId;
  }

  getTotalOrdersReceived() {
    let totalOrdersReceived = _.reduce(this._getStockOrders(), (memo, value) => {
      return memo + (value.ingredient.cost * value.orderedCount);
    }, 0);
    return HospoHero.misc.rounding(totalOrdersReceived, 100);
  }

  getDetailedOrdersReceived() {
    return this._getStockOrders().map((item) => {
      return {
        stockId: item.stockId,
        price: HospoHero.misc.rounding(item.ingredient.cost * item.orderedCount)
      };
    });
  }

  _getStockOrders() {
    let orderReceiptsIds = this._getOrderReceiptsIds();
    let findQuery = {
      orderId: {
        $in: orderReceiptsIds
      },
      'relations.areaId': this._areaId
    };
    let projectionQuery = {
      fields: {
        _id: 0,
        orderedCount: 1,
        ingredient: 1
      }
    };

    return OrderItems.find(findQuery, projectionQuery).fetch();
  }

  _getOrderReceiptsIds() {
    let findQuery = {
      stocktakeId: {$in: this._stocktakeIds},
      'relations.areaId': this._areaId
    };
    let projectionQuery = {
      fields: {
        _id: 1
      }
    };

    return _.pluck(Orders.find(findQuery, projectionQuery).fetch(), '_id');
  }
}


Namespace('HospoHero.reporting', {
  OrdersReporter: OrdersReporter
});