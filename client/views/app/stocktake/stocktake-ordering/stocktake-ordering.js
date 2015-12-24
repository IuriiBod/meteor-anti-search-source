Template.stocktakeOrdering.onCreated(function () {
  this.set('activeSupplierId', null);
});

Template.stocktakeOrdering.helpers({
  isNotEmpty: function () {
    return !!StockOrders.find({
      version: this.stocktakeMainId
    }).count();
  },

  stockOrdersList: function (activeSupplierId) {
    return StockOrders.find({
      version: this.stocktakeMainId,
      supplier: activeSupplierId
    });
  },

  orderNote: function (activeSupplierId) {
    var data = OrderReceipts.findOne({
      version: this.stocktakeMainId,
      supplier: activeSupplierId
    });

    return data && data.orderNote;
  },

  onSupplierChanged: function () {
    var tmpl = Template.instance();
    return function (supplierId) {
      tmpl.set('activeSupplierId', supplierId);
    }
  }
});

Template.stocktakeOrdering.events({
  'keyup .supplier-order-note': function (event, tmpl) {
    event.preventDefault();
    if (event.keyCode == 13) {
      var noteText = $(event.target).val().trim();

      if (noteText.length > 0) {
        var activeSupplierId = tmpl.get('activeSupplierId');
        var version = tmpl.data.stocktakeMainId;

        var receipt = OrderReceipts.findOne({supplier: activeSupplierId, version: version});

        var info = {
          orderNote: noteText,
          version: version,
          supplier: activeSupplierId
        };

        Meteor.call("updateReceipt", receipt._id, info, HospoHero.handleMethodResult());
      }
    }
  }
});

var initialHtml = function (spplierId) {
  var supplier = Suppliers.findOne(supplierId);
  var receipt = receiptData(this.data, supplier);
  Meteor.call('renderSomeHandlebarsTemplate', 'supplier-email-text', receipt, HospoHero.handleMethodResult(function (text) {
    //todo: open modal here
  }));
};

var receiptData = function (tmplData, supplier) {
  var receipt = OrderReceipts.findOne({"version": tmplData.orderId, "supplier": supplier._id});
  var total = 0;

  var data = StockOrders.find({
    version: tmplData.orderId,
    supplier: supplier._id,
    'relations.areaId': HospoHero.getCurrentAreaId(),
    countOrdered: {$gt: 0}
  }, {
    fields: {
      countOrdered: 1,
      unit: 1,
      stockId: 1,
      unitPrice: 1
    }
  }).fetch();
  data = _.map(data, function (stock) {
    var stockItem = Ingredients.findOne({_id: stock.stockId}, {fields: {code: 1, description: 1}});
    var cost = stock.countOrdered * stock.unitPrice;
    stockItem.cost = cost.toFixed(2);

    total += cost;

    return _.extend(stock, stockItem);
  });

  var area = HospoHero.getCurrentArea();
  var location = Locations.findOne({_id: area.locationId});

  var deliveryDate = receipt && receipt.expectedDeliveryDate ? receipt.expectedDeliveryDate : moment().add(1, 'day');

  var user = {
    name: HospoHero.username(Meteor.userId()),
    type: HospoHero.roles.getUserRoleName(Meteor.userId(), HospoHero.getCurrentAreaId())
  };

  return {
    supplierName: supplier.name,
    deliveryDate: HospoHero.dateUtils.dateFormat(deliveryDate),
    orederNote: receipt && receipt.orderNote || '',
    location: location,
    areaName: area.name,
    orderData: data,
    total: total,
    user: user
  };
};