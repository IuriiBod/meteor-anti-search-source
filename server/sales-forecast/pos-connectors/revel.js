// disable camelcase warnings
/*jshint camelcase: false */

Revel = function Revel(posCredentials) {
  this._posCredentials = posCredentials;
  this.DATA_LIMIT = 5000;
};


Revel.prototype._convertOptionsToQueryParams = function (options) {
  var queryParams = {
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
};

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
Revel.prototype._queryResource = function (resourceName, options) {
  try {
    var pos = this._posCredentials;

    var queryParams = this._convertOptionsToQueryParams(options);

    var response = HTTP.get(pos.host + '/resources/' + resourceName, {
      headers: {
        'API-AUTHENTICATION': pos.key + ':' + pos.secret
      },
      params: queryParams
    });

    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Meteor.Error(response.statusCode, 'Error while connecting to Revel');
    }
  } catch (err) {
    logger.error('Error while connecting to Revel', {response: err});
    return false;
  }
};

/**
 * Loads product (menu) items from from Revel
 *
 * @returns {boolean|Array}
 */
Revel.prototype.loadProductItems = function () {
  var result = this._queryResource('Product', {
    fields: ['name', 'price', 'id']
  });

  return result && _.isArray(result.objects) && result.objects.map(function (item) {
      return {
        posId: item.id,
        name: item.name,
        price: item.price
      };
    });
};

/**
 * Loads order items from Revel
 *
 * @param {number} offset loading offset
 * @returns {boolean|Array}
 */
Revel.prototype.loadOrderItems = function (offset) {
  var queryOptions = {
    'order_by': '-created_date',
    fields: [
      'created_date',
      'quantity',
      'product'
    ],
    offset: offset
  };

  return this._queryResource('OrderItem', queryOptions);
};

/**
 * Uploads order items for particular product in Revel
 *
 * @param onDateReceived callback receives sales data for one day, should return false to stop iteration
 */
Revel.prototype.uploadAndReduceOrderItems = function (onDateReceived) {
  var offset = 0;
  var totalCount = false;
  var toContinue = true;

  var bucket = new RevelSalesDataBucket();

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

    if (!totalCount) {
      totalCount = result.meta.total_count;
      bucket.timezone(result.meta.time_zone);
    }

    logger.info('Requested to Revel', {offset: offset, total: totalCount});

    result.objects.every(processEntry);

    offset += this.DATA_LIMIT;
  }
};

/**
 * Uploads order items 'as is' for the last year
 * (Method is temporal, may be removed in future)
 *
 * @param onOrdersLoaded
 */
Revel.prototype.uploadRawOrderItems = function (onOrdersLoaded) {
  var offset = 0;
  var totalCount = false;
  var yearBackMoment = moment().subtract(1, 'year');

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

    var toContinue = onOrdersLoaded(result.objects);

    //check if 1 year is imported
    var lastOrder = result.objects[result.objects.length - 1];
    if (yearBackMoment.isAfter(lastOrder.created_date) || !toContinue) {
      break;
    }

    offset += this.DATA_LIMIT;
  }
};


/**
 * Used to collect and group by menu item loaded data
 *
 * @constructor
 */
var RevelSalesDataBucket = function () {
  this._data = {};
  this._dayNumber = false;
};


RevelSalesDataBucket.prototype.timezone = function (timezoneStr) {
  this._timezone = timezoneStr;
};

//if entity related to other date returns false
RevelSalesDataBucket.prototype.put = function (entry) {
  var dayOfYear = moment.tz(entry.created_date, this._timezone).dayOfYear();
  var productName = entry.product;

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
};


RevelSalesDataBucket.prototype.getDataAndReset = function () {
  //convert to appropriate time zone
  var createdMoment = moment.tz(this._createdDate, this._timezone).startOf('day');

  var result = {
    menuItems: this._data,
    createdMoment: createdMoment
  };

//reset project
  this._data = {};
  this._dayNumber = false;

  return result;
};


RevelSalesDataBucket.prototype.isEmpty = function () {
  return this._dayNumber === false;
};


if (Meteor.settings.prediction.useRawOrders === true) {
  _.extend(Revel.prototype, {
    loadOrderItems: function (offset) {
      logger.info('Mock loadOrderItems', {offset: offset});
      var limit = 5000;
      var result = {
        meta: {
          'limit': limit,
          'offset': offset,
          'time_zone': 'Australia/Melbourne',
          'total_count': RawOrders.find({}).count()
        },
        objects: []
      };

      var query = {};
      result.objects = RawOrders.find(query, {limit: limit, skip: offset, sort: {created_date: -1}}).fetch();

      return result;
    }
  });
}