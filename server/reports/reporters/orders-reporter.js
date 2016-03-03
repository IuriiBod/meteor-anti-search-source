OrdersReporter = class {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   * @param {string} areaId Mongo ID
   */
  constructor(fromDate, toDate, areaId) {
    this._fromDate = fromDate;
    this._toDate = toDate;
    this._areaId = areaId;
    this._dateQuery = {
      $gte: moment(fromDate, 'DD/MM/YY').unix() * 1000,
      $lte: moment(toDate, 'DD/MM/YY').unix() * 1000
    };
  }

  getTotalOrdersReceived() {
    let totalOrdersReceived = _.reduce(this._getStockOrders(), (memo, value) => {
      return memo + (value.unitPrice * value.countOrdered);
    }, 0);
    return HospoHero.misc.rounding(totalOrdersReceived, 100);
  }

  getDetailedOrdersReceived() {
    return this._getStockOrders().map((item) => {
      return {
        stockId: item.stockId,
        price: HospoHero.misc.rounding(item.unitPrice * item.countOrdered)
      }
    });
  }

  _getStockOrders() {
    let orderReceiptsIds = this._getOrderReceiptsIds();
    let findQuery = {
      orderReceipt: {
        $in: orderReceiptsIds
      },
      'relations.areaId': this._areaId
    };
    let projectionQuery = {
      fields: {
        _id: 0,
        unitPrice: 1,
        stockId: 1,
        countOrdered: 1
      }
    };

    return StockOrders.find(findQuery, projectionQuery).fetch();
  }

  _getOrderReceiptsIds() {
    let findQuery = {
      stocktakeDate: this._dateQuery,
      'relations.areaId': this._areaId
    };
    let projectionQuery = {
      fields: {
        _id: 1
      }
    };

    return _.pluck(OrderReceipts.find(findQuery, projectionQuery).fetch(), '_id');
  }
};