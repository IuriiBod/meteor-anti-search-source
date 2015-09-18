var HOST = Meteor.settings.private.Revel.HOST;
var KEY = Meteor.settings.private.Revel.KEY;
var SECRET = Meteor.settings.private.Revel.SECRET;

Revel = {
  queryRevelResource: function (resource, orderBy, isAscending, fields, limit, offset) {
    var orderByStr;

    if (isAscending) {
      orderByStr = orderBy;
    } else {
      orderByStr = '-' + orderBy;
    }

    try {
      var response = HTTP.get(HOST + '/resources/' + resource, {
        headers: {
          'API-AUTHENTICATION': KEY + ':' + SECRET
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

  queryRevelOrderItems: function (limit, offset) {
    return this.queryRevelResource('OrderItem', 'created_date', false, [
      'product_name_override',
      'created_date',
      'quantity'
    ], limit, offset);
  },

  uploadAndReduceOrderItems: function (onDateReceived, onUploadFinish, maxDaysCount) {
    if (!maxDaysCount) {
      maxDaysCount = 365; // get data for last year by default
    }
    var daysCount = 0;
    var limit = 5000;
    var offset = 0;
    var totalCount = limit;

    var bucket = new RevelSalesDataBucket();

    while (offset <= totalCount && daysCount < maxDaysCount) {
      logger.info('Request to Revel server', {offset: offset, total: totalCount});
      var result = this.queryRevelOrderItems(limit, offset);

      //handle Revel API error
      if (result === false) {
        onUploadFinish(-1);
        return;
      }

      if (totalCount === limit) {
        totalCount = result.meta.total_count;
      }

      result.objects.forEach(function (entry) {
        if (!bucket.put(entry)) {
          onDateReceived(bucket.getDataAndReset());
          daysCount++;
        }
      });

      offset += limit;
    }

    if (!bucket.isEmpty()) {
      //get everything else
      onDateReceived(bucket.getDataAndReset());
      daysCount++;
    }

    onUploadFinish(daysCount);
  }
};


//==== RevelSalesDataBucket ===

var RevelSalesDataBucket = function () {
  this._data = {};
  this._dayNumber = false;
};

//if entity related to other date returns false
RevelSalesDataBucket.prototype.put = function (entry) {
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
    createdDate: this._createdDate
  };

//reset project
  this._data = {};
  this._dayNumber = false;

  return result;
};

RevelSalesDataBucket.prototype.isEmpty = function () {
  return this._dayNumber === false
};

