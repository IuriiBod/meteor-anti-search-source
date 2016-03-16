Template.composeStocktakeOrderingEmail.onCreated(function () {
  this.set('initialHtml', '');

  var self = this;
  var receiptData = function () {
    var version = self.data.stocktakeMainId;
    var supplierId = self.data.supplier._id;

    var convertStockOrder = function (stockOrder) {
      var stockItem = Ingredients.findOne({_id: stockOrder.stockId}, {fields: {code: 1, description: 1}});
      var cost = stockOrder.countOrdered * stockOrder.unitPrice;
      stockItem.cost = cost.toFixed(2);
      total += cost;
      return _.extend(stockOrder, stockItem);
    };

    var total = 0;
    var ordersData = OrderItems.find({
      version: version,
      supplier: supplierId,
      'relations.areaId': HospoHero.getCurrentAreaId(),
      countOrdered: {$gt: 0}
    }, {
      fields: {
        countOrdered: 1,
        unit: 1,
        stockId: 1,
        unitPrice: 1
      }
    }).map(convertStockOrder);

    var area = HospoHero.getCurrentArea();
    var location = Locations.findOne({_id: area.locationId});

    var user = {
      name: HospoHero.username(Meteor.userId()),
      type: HospoHero.roles.getUserRoleName(Meteor.userId(), HospoHero.getCurrentAreaId())
    };

    var receipt = Orders.findOne({
      version: version,
      supplier: supplierId
    });

    var deliveryDate = receipt && receipt.expectedDeliveryDate ? receipt.expectedDeliveryDate : moment().add(1, 'day');

    return {
      supplierName: self.data.supplier.name,
      deliveryDate: HospoHero.dateUtils.dateFormat(deliveryDate),
      orderNote: receipt && receipt.orderNote || '',
      location: location,
      areaName: area.name,
      orderData: ordersData,
      total: total.toFixed(2),
      user: user
    };
  };

  Meteor.call('renderSomeHandlebarsTemplate', 'supplier-email-text', receiptData(), HospoHero.handleMethodResult(function (text) {
    self.set('initialHtml', text);
  }));
});

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

