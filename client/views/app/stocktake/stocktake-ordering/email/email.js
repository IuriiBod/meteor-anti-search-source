Template.composeStocktakeOrderingEmail.helpers({
  subject: function () {
    var location = Locations.findOne({_id: this.supplier.relations.locationId});
    var area = Areas.findOne({_id: this.supplier.relations.areaId});
    return "Order from " + location.name + ' ' + area.name;
  },

  replyToEmail: function () {
    var user = Meteor.user();
    return user.emails[0].address;
  }
});

Template.composeStocktakeOrderingEmail.events({
  'click .send-email-button': function (event, tmpl) {
    event.preventDefault();
    var deliveryDateTimeStamp = moment().add(1, 'day').valueOf();
    var mailTo = tmpl.$('.emailTo').val();
    var info = {
      through: 'emailed',
      details: mailTo,
      deliveryDate: deliveryDateTimeStamp,
      to: mailTo,
      title: tmpl.$('.emailSubject').val(),
      emailText: tmpl.$('.summernote').data('summernote').code()
    };

    Meteor.call("generateReceipts", tmpl.data.stocktakeMainId, tmpl.data.supplier._id, info, HospoHero.handleMethodResult(function () {
      ModalManager.getInstanceByElement(event.target).close();
    }));
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