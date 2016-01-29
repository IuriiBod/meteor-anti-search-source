OrdersReporter = class {
  /**
   * @param {string} fromDate DD/MM/YY
   * @param {string} toDate DD/MM/YY
   */
  constructor(fromDate, toDate) {
    this._fromDate = fromDate;
    this._toDate = toDate;
    this._dateQuery = {
      $gte: moment(fromDate, 'DD/MM/YY').unix() * 1000, // TODO Change in case of migration to plain Date object in collection
      $lte: moment(toDate, 'DD/MM/YY').unix() * 1000
    };
  }

  getTotalOrdersReceived() {
    let totalOrdersReceived = _.reduce(this._getStockOrders(), (memo, value) => {
      return memo + (value.unitPrice * value.countOrdered);
    }, 0);
    return HospoHero.misc.rounding(totalOrdersReceived, 100);
  }

  _getStockOrders() {
    let orderReceiptsIds = this._getOrderReceiptsIds();
    let findQuery = {
      orderReceipt: {
        $in: orderReceiptsIds
      }
    };
    let projectionQuery = {
      fields: {
        _id: 0,
        unitPrice: 1,
        countOrdered: 1
      }
    };

    return StockOrders.find(findQuery, projectionQuery).fetch();
  }

  _getOrderReceiptsIds() {
    let findQuery = {
      stocktakeDate: this._dateQuery
    };
    let projectionQuery = {
      fields: {
        _id: 1
      }
    };

    return _.pluck(OrderReceipts.find(findQuery, projectionQuery).fetch(), '_id');
  }
};