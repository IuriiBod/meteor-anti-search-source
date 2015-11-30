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

Revel.prototype.loadProductItems = function () {
  var result = this._queryResource('Product', {
    fields: ['name', 'price', 'id']
  });

  return result && _.isArray(result.objects) && result.objects.map(function (item) {
      return {
        posId: item.id,
        name: item.name,
        price: item.price
      }
    });
};

/**
 * Loads order items from Revel
 *
 * @param offset loading offset
 * @param {*|string|number} revelMenuItemId load only order items for specific product
 * @returns {boolean|Array}
 */
Revel.prototype.loadOrderItems = function (offset, revelMenuItemId) {
  var queryOptions = {
    order_by: '-created_date',
    fields: [
      'created_date',
      'quantity'
    ],
    offset: offset,
    product: revelMenuItemId
  };

  return this._queryResource('OrderItem', queryOptions);
};

/**
 * Uploads order items for particular product in Revel
 *
 * @param onDateReceived callback receives sales data for one day, should return false to stop iteration
 * @param revelMenuItemId ID of product item in Revel POS
 */
Revel.prototype.uploadAndReduceOrderItems = function (onDateReceived, revelMenuItemId) {
  var offset = 0;
  var totalCount = false;
  var toContinue = true;

  var bucket = new RevelSalesDataBucket();

  while (offset <= totalCount && toContinue) {

    var result = this.loadOrderItems(offset, revelMenuItemId);

    //handle Revel API error
    if (result === false) {
      return;
    }

    if (!totalCount) {
      totalCount = result.meta.total_count;
      bucket.timezone(result.meta.time_zone);
    }

    logger.info('Requested to Revel', {offset: offset, total: totalCount});

    result.objects.every(function (entry) {
      if (!bucket.put(entry)) {
        toContinue = onDateReceived(bucket.getDataAndReset());
        bucket.put(entry); //put next day entry
        return toContinue;
      }
      return true;
    });

    offset += this.DATA_LIMIT;
  }
};


/**
 * Used to collect and group by menu item loaded data
 *
 * @constructor
 */
var RevelSalesDataBucket = function () {
  this._quantity = 0;
  this._dayNumber = false;
};


RevelSalesDataBucket.prototype.timezone = function (timezoneStr) {
  this._timezone = timezoneStr;
};

//if entity related to other date returns false
RevelSalesDataBucket.prototype.put = function (entry) {
  var dayOfYear = moment(entry.created_date).dayOfYear();

  if (this.isEmpty()) {
    this._dayNumber = dayOfYear;
    this._createdDate = entry.created_date;
  }

  if (dayOfYear === this._dayNumber) {
    this._quantity += entry.quantity;
    return true;
  }

  return false;
};

RevelSalesDataBucket.prototype.getDataAndReset = function () {
  //convert to start of day
  var startOfCreatedDate = moment(this._createdDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss');

  //convert to appropriate time zone
  var createdDate = moment.tz(startOfCreatedDate, this._timezone).toDate();

  var result = {
    quantity: this._quantity,
    createdDate: createdDate
  };

//reset project
  this._quantity = 0;
  this._dayNumber = false;

  return result;
};

RevelSalesDataBucket.prototype.isEmpty = function () {
  return this._dayNumber === false
};


//======== mock data provider ============
if (HospoHero.isDevelopmentMode()) {
  var random = function (n) {
    return Math.floor(Math.random() * n);
  };

  /**
   * Data source with mock data for development mode
   */
  var MockOrderItemDataSource = function MockOrderItemDataSource() {
    this.currentDate = moment();
  };

  MockOrderItemDataSource.prototype.load = function () {
    var result = {
      meta: {
        'limit': 5000,
        'offset': 0,
        'time_zone': 'Australia/Melbourne',
        'total_count': 61614200
      },
      objects: []
    };

    var self = this;

    for (var i = 0; i < 5000; i++) {
      var pushObject = {
        created_date: self.currentDate.format('YYYY-MM-DDTHH:mm:ss'),
        quantity: random(5) + 50
      };
      result.objects.push(pushObject);
      if (random(3) === 0) {//33% to go to next day
        this.currentDate.subtract(1, 'd');
      }
    }

    return result;
  };

  //add mock data source
  _.extend(Revel.prototype, {
    loadOrderItems: function (offset, revelProductId) {
      if (offset === 0) {
        this._mockRevelSource = new MockOrderItemDataSource();
      }
      console.log('mock items generator offset=', offset, '  id=', revelProductId);
      return this._mockRevelSource.load();
    },
    loadProductItems: function () {
      var productItems = MenuItems.find({}, {limit: 10});
      return productItems.map(function (item) {
        return {
          name: item.name + ' POS',
          price: random(100),
          posId: random(300)
        }
      });
    }
  });
}