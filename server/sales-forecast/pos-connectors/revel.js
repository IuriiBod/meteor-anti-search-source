// disable camelcase warnings
/*jshint camelcase: false */

/**
 * Allows loading data from Revel POS system
 * @param posCredentials APIs' key, secret and host
 * @constructor
 */
Revel = class Revel {
  constructor(posCredentials) {
    this._posCredentials = posCredentials;
    this.DATA_LIMIT = 5000;
    this._delayAfterFailedRquest = 3000; // in ms
    this._maximumFailsBeforeQuit = 3;
  }

  _convertOptionsToQueryParams(options) {
    let queryParams = {
      limit: this.DATA_LIMIT,
      format: 'json',
      offset: 0
    };

    if (options) {
      _.extend(queryParams, options);
    }

    if (queryParams.fields) {
      queryParams.fields = queryParams.fields.join(',');
    }

    return queryParams;
  }

  /**
   * Queries particular resource from Revel
   *
   * @param resourceName
   * @param {object} options - custom query options
   * @param {string} options.order_by - property to order (for descending order add "-" before property name)
   * @param {Array} options.fields - fields to pick
   * @param {number} options.offset - used for pagination
   * @returns {boolean|Array} false - if we got an error
   * @private
   */
  _queryResource(resourceName, options) {
    let failsCount = 0;
    let needToDoRequestAgain = () => failsCount < this._maximumFailsBeforeQuit;

    let pos = this._posCredentials;
    let queryParams = this._convertOptionsToQueryParams(options);
    let queryResult = false;


    while (needToDoRequestAgain()) {
      try {
        let response = HTTP.get(pos.host + '/resources/' + resourceName, {
          headers: {
            'API-AUTHENTICATION': pos.key + ':' + pos.secret
          },
          params: queryParams
        });

        if (response.statusCode === 200) {
          queryResult = response.data;
          break;
        } else {
          throw new Meteor.Error(response.statusCode, 'Revel responded with bad status code');
        }
      } catch (err) {
        failsCount++;
        logger.error(`Revel API Fail #${failsCount}:`, {response: err.stack});

        if (needToDoRequestAgain()) {
          Meteor._sleepForMs(this._delayAfterFailedRquest); //wait before repeating request
        }
      }
    }

    return queryResult;
  }

  _getOrdersOffset() {
    return Meteor.settings.prediction.revelCustomOffset || 0;
  }

  /**
   * Loads product (menu) items from from Revel
   *
   * @returns {boolean|Array}
   */
  loadProductItems() {
    let result = this._queryResource('Product', {
      fields: ['name', 'price', 'id']
    });

    return result && _.isArray(result.objects) && result.objects.map(function (item) {
        return {
          posId: item.id,
          name: item.name,
          price: item.price
        };
      });
  }

  /**
   * Loads order items from Revel
   *
   * @param {number} offset loading offset
   * @returns {boolean|Array}
   */
  loadOrderItems(offset) {
    let queryOptions = {
      'order_by': '-created_date',
      fields: [
        'created_date',
        'quantity',
        'product'
      ],
      offset: offset
    };

    return this._queryResource('OrderItem', queryOptions);
  }

  /**
   * Uploads order items for particular product in Revel
   *
   * @param onDateReceived callback receives sales data for one day, should return false to stop iteration
   */
  uploadAndReduceOrderItems(onDateReceived) {
    let offset = this._getOrdersOffset();
    let totalCount = Infinity;
    let toContinue = true;

    let bucket = new RevelSalesDataBucket();

    let processEntry = function (entry) {
      if (!bucket.put(entry)) {
        toContinue = onDateReceived(bucket.getDataAndReset());
        bucket.put(entry); //put next day entry
        return toContinue;
      }
      return true;
    };

    while (offset <= totalCount && toContinue) {

      let result = this.loadOrderItems(offset);

      //handle Revel API error
      if (result === false) {
        return;
      }

      if (totalCount === Infinity) {
        totalCount = result.meta.total_count;
        bucket.timezone(result.meta.time_zone);
      }

      logger.info('Requested to Revel', {offset: offset, total: totalCount});

      result.objects.every(processEntry);

      offset += this.DATA_LIMIT;
    }
  }

  /**
   * Uploads order items 'as is' for the last year
   * (Method is temporal, may be removed in future)
   *
   * @param onOrdersLoaded
   */
  uploadRawOrderItems(onOrdersLoaded) {
    let offset = this._getOrdersOffset();
    let totalCount = Infinity;
    let yearBackMoment = moment().subtract(1, 'year');

    while (true) {
      var result = this.loadOrderItems(offset);

      //handle Revel API error
      if (result === false) {
        return;
      }

      if (!totalCount) {
        totalCount = result.meta.total_count;
      }

      logger.info('Requested to Revel', {offset: offset, total: totalCount});

      let toContinue = onOrdersLoaded(result.objects);

      //check if 1 year is imported
      let lastOrder = result.objects[result.objects.length - 1];
      if (yearBackMoment.isAfter(lastOrder.created_date) || !toContinue) {
        break;
      }

      offset += this.DATA_LIMIT;
    }
  }
};


/**
 * Used to collect and group by menu item loaded data
 *
 * @constructor
 */
class RevelSalesDataBucket {
  constructor() {
    this._data = {};
    this._dayNumber = false;
  }


  timezone(timezoneStr) {
    this._timezone = timezoneStr;
  }

  //if entity related to other date returns false
  put(entry) {
    let dayOfYear = moment.tz(entry.created_date, this._timezone).dayOfYear();
    let productName = entry.product;

    if (this.isEmpty()) {
      this._dayNumber = dayOfYear;
      this._createdDate = entry.created_date;
    }

    if (dayOfYear === this._dayNumber) {
      if (!isFinite(this._data[productName])) {
        this._data[productName] = 0;
      }

      this._data[productName] += entry.quantity;
      return true;
    }

    return false;
  }

  getDataAndReset() {
    //convert to appropriate time zone
    let createdMoment = moment.tz(this._createdDate, this._timezone).startOf('day');

    let result = {
      menuItems: this._data,
      createdMoment: createdMoment
    };

    //reset project
    this._data = {};
    this._dayNumber = false;

    return result;
  }

  isEmpty() {
    return this._dayNumber === false;
  }
}


if (Meteor.settings.prediction.useRawOrders === true) {
  _.extend(Revel.prototype, {
    loadOrderItems: function (offset) {
      logger.info('Mock loadOrderItems', {offset: offset});
      let limit = 5000;
      let result = {
        meta: {
          limit: limit,
          offset: offset,
          time_zone: 'Australia/Melbourne',
          total_count: RawOrders.find({}).count()
        },
        objects: []
      };

      let query = {};
      result.objects = RawOrders.find(query, {limit: limit, skip: offset, sort: {created_date: -1}}).fetch();

      return result;
    }
  });
}