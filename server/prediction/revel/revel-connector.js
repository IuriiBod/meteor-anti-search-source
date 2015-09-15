var HOST = Meteor.settings.private.Revel.HOST;
var KEY = Meteor.settings.private.Revel.KEY;
var SECRET = Meteor.settings.private.Revel.SECRET;

var queryRevelResource = function (resource, orderBy, isAscending, fields, limit, offset) {
  var orderByStr;

  if (isAscending) {
    orderByStr = orderBy;
  } else {
    orderByStr = '-' + orderBy;
  }

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
};


var queryRevelOrderItems = function (limit, offset) {
  return queryRevelResource('OrderItem', 'created_date', false, [
    'product_name_override',
    'created_date',
    'quantity'
  ], limit, offset);
};


importRevelOrderItems = function () {
  var limit = 1000;
  var offset = 0;
  var totalCount = limit;

  var bucket = {};
  var putIntoBucket = function (entity) {
    var dayOfYear = moment(entity.created_date).dayOfYear();
    var productName = entity.product_name_override;

    if (!bucket[productName]) {
      bucket[productName] = {};
    }

    if (!bucket[productName][dayOfYear]) {
      bucket[productName][dayOfYear] = 0;
    }

    bucket[productName][dayOfYear] += entity.quantity;
  };

  while (offset <= 3000) {
    var result = queryRevelOrderItems(limit, offset);
    totalCount = result.total_count;

    result.objects.forEach(putIntoBucket);

    offset += limit;
  }

  return bucket;
};