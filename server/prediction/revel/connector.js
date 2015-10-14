var HOST = Meteor.settings.Revel.HOST;
var KEY = Meteor.settings.Revel.KEY;
var SECRET = Meteor.settings.Revel.SECRET;

Revel = {
  DATA_LIMIT: 5000,
  queryRevelResource: function (resource, orderBy, isAscending, fields, limit, offset, pos) {
    var orderByStr;

    if (isAscending) {
      orderByStr = orderBy;
    } else {
      orderByStr = '-' + orderBy;
    }

    try {
      var response = HTTP.get(pos.host + '/resources/' + resource, {
        headers: {
          'API-AUTHENTICATION': pos.key + ':' + pos.secret
        },
        params: {
          limit: limit,
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
  },

  queryRevelOrderItems: function (limit, offset, pos) {
    return this.queryRevelResource('OrderItem', 'created_date', false, [
      'product_name_override',
      'created_date',
      'quantity'
    ], limit, offset, pos);
  },

  /**
   *Iterates through order items in Revel
   * @param onDateReceived - callback receives sales data for one day, should return false to stop iteration
   */
  uploadAndReduceOrderItems: function (onDateReceived, pos) {
    var offset = 0;
    var totalCount = this.DATA_LIMIT;
    var toContinue = true;

    var bucket = new RevelSalesDataBucket();

    //temporal mock datasource
    var mockRevel = new MockOrderItemDataSource();

    while (offset <= totalCount && toContinue) {
      logger.info('Request to Revel server', {offset: offset, total: totalCount});

      if (HospoHero.isDevelopmentMode()) {
        var result = mockRevel.load(this.DATA_LIMIT, offset);
      } else {
        var result = this.queryRevelOrderItems(this.DATA_LIMIT, offset, pos);
      }

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
  }
};


//==== RevelSalesDataBucket ===

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

