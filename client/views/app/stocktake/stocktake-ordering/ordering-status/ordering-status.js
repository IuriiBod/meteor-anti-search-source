//todo: solve modal problem
Template.orderingStatus.onRendered(function () {
  this.$('.expectedDeliveryDate').datepicker({
    todayHighlight: true,
    weekStart: 1
  });

  this.generateReceipts = function (orderType) {
    var supplier = this.data.activeSupplierId;
    var info = {
      through: orderType,
      details: null,
      deliveryDate: moment().add(1, 'days').format('x')
    };
    if (orderType == 'emailed') {

      $("#composeMailModal").modal();
    } else {
      Meteor.call("generateReceipts", this.data.stocktakeMainId, supplier, info, HospoHero.handleMethodResult());
    }
  };
});


Template.orderingStatus.helpers({
  receipt: function () {
    return OrderReceipts.findOne({
      version: this.stocktakeMainId,
      supplier: this.activeSupplierId,
      'orderedThrough.through': {$ne: null}
    });
  },

  deliveryDate: function (receipt) {
    return receipt && receipt.expectedDeliveryDate || moment().add(1, 'day');
  },

  orderSentDetails: function (receipt) {
    return receipt && receipt.orderedThrough.through == "emailed" && "Email sent " || "Phoned " +
      moment(receipt.date).format("MMMM Do YYYY, h:mm:ss a");
  }
});


Template.orderingStatus.events({
  'click .order-emailed-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('emailed');
  },

  'click .order-phoned-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('phoned');
  },

  'changeDate .expected-delivery-date-picker': function (event, tmpl) {
    var supplierId = tmpl.data.activeSupplierId;
    var version = tmpl.data.stocktakeMainId;
    var receipt = OrderReceipts.findOne({supplier: supplierId, version: version});
    var info = {
      expectedDeliveryDate: moment(event.date).startOf('day').getTime(),
      version: version,
      supplier: supplierId
    };
    Meteor.call("updateReceipt", receipt._id, info, HospoHero.handleMethodResult());
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