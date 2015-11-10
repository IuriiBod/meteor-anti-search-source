Revel = function Revel(posCredentials) {
  this._posCredentials = posCredentials;
  this.DATA_LIMIT = 5000;
};


Revel.prototype.queryRevelResource = function (resource, orderBy, isAscending, fields, offset) {
  var orderByStr;

  if (isAscending) {
    orderByStr = orderBy;
  } else {
    orderByStr = '-' + orderBy;
  }

  try {
    var pos = this._posCredentials;

    var response = HTTP.get(pos.host + '/resources/' + resource, {
      headers: {
        'API-AUTHENTICATION': pos.key + ':' + pos.secret
      },
      params: {
        limit: this.DATA_LIMIT,
        offset: offset,
        order_by: orderByStr,
        fields: fields.join(','),
        format: 'json'
      }
    });
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Meteor.Error(response.statusCode, 'Error while connecting to Revel');
    }
  } catch (err) {
    logger.info('Error while connecting to Revel', {response: err});
    return false;
  }
};

Revel.prototype.queryRevelProductItems = function () {
  var items = this.queryRevelResource('Product', 'id', true, ['name', 'price'], 0);
  return _.map(items.objects, function (item) {
    return {
      name: item.name,
      price: item.price
    }
  })
};

Revel.prototype.queryRevelOrderItems = function (offset) {
  return this.queryRevelResource('OrderItem', 'created_date', false, [
    'product_name_override',
    'created_date',
    'quantity'
  ], offset);
};

/**
 *Iterates through order items in Revel
 * @param onDateReceived callback receives sales data for one day, should return false to stop iteration
 */
Revel.prototype.uploadAndReduceOrderItems = function (onDateReceived) {
  var offset = 0;
  var totalCount = this.DATA_LIMIT;
  var toContinue = true;

  var bucket = new RevelSalesDataBucket();

  while (offset <= totalCount && toContinue) {
    logger.info('Request to Revel server', {offset: offset, total: totalCount});

    var result = this.queryRevelOrderItems(offset);

    //handle Revel API error
    if (result === false) {
      return;
    }

    if (totalCount === this.DATA_LIMIT) {
      totalCount = result.meta.total_count;
    }

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
 * @constructor
 */
var RevelSalesDataBucket = function () {
  this._data = {};
  this._dayNumber = false;
};

//if entity related to other date returns false
RevelSalesDataBucket.prototype.put = function (entry) {
  //console.log(entry.created_date);
  var dayOfYear = moment(entry.created_date).dayOfYear();
  var productName = entry.product_name_override;

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
  var result = {
    menuItems: this._data,
    createdDate: new Date(this._createdDate)
  };

//reset project
  this._data = {};
  this._dayNumber = false;

  return result;
};

RevelSalesDataBucket.prototype.isEmpty = function () {
  return this._dayNumber === false
};


//======== mock data provider ============
if (HospoHero.isDevelopmentMode()) {
  /**
   * Data source with mock data for development mode
   */
  var MockOrderItemDataSource = function MockOrderItemDataSource() {
    this.currentDate = moment();
  };

  MockOrderItemDataSource.prototype.load = function () {
    var query = HospoHero.prediction.getMenuItemsForPredictionQuery();
    var items = MenuItems.find(query).fetch();

    var result = {
      meta: {
        'limit': 5000,
        'offset': 0,
        'total_count': 616142
      },
      objects: []
    };

    var self = this;

    _.each(items, function (item) {
      var pushObject = {
        created_date: self.currentDate.format('YYYY-MM-DDTHH:mm:ss'),
        product_name_override: item.name,
        quantity: Math.floor(Math.random() * 10 + 1)
      };
      result.objects.push(pushObject);
    });
    this.currentDate.subtract(1, 'd');
    return result
  };

  //add mock data source
  _.extend(Revel.prototype, {
    queryRevelOrderItems: function (offset) {
      if (!this._mockRevelSource) {
        this._mockRevelSource = new MockOrderItemDataSource();
      }
      return this._mockRevelSource.load(context.DATA_LIMIT, offset);
    },
    queryRevelProductItems: function () {
      var productItems = PosMenuItems.find().fetch();
      return _.map(productItems, function (item) {
        return {
          name: item.name,
          price: Math.round(Math.random()*15)
        }
      })
    }
  });
}