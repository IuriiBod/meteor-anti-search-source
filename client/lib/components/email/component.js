var component = FlowComponents.define("composeMail", function (props) {});

component.state.componentRendered = function () {
  var supplierId = Session.get("activeSupplier");
  var supplier = Suppliers.findOne(supplierId);

  var receipt = OrderReceipts.findOne({"version": Session.get("thisVersion"), "supplier": supplierId});
  var total = 0;
  var data = StockOrders.find({
    "version": Session.get("thisVersion"),
    "supplier": supplierId,
    "relations.areaId": HospoHero.getCurrentAreaId(),
    "countOrdered": {$gt: 0}
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
    stockItem.cost = cost;

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

  var templateData = {
    supplierName: supplier.name,
    deliveryDate: HospoHero.dateUtils.dateFormat(deliveryDate),
    orederNote: receipt && receipt.orderNote || '',
    location: location,
    areaName: area.name,
    orderData: data,
    total: total,
    user: user
  };

  var self = this;
  Meteor.call('renderSomeHandlebarsTemplate', 'supplier-email-text', templateData, HospoHero.handleMethodResult(function(text) {
    self.set('initialHTML', text);
  }));
};

component.state.subject = function () {
  return "Order from Hospo Hero";
};

component.state.supplier = function () {
  var supplierId = Session.get("activeSupplier");
  return Suppliers.findOne(supplierId);
};

component.state.replyToEmail = function () {
  var user = Meteor.user();
  if (user && user.emails) {
    this.set("username", user.username);

    var role = "Worker";
    if (HospoHero.isManager()) {
      role = "Manager";
    }
    this.set("userType", role);
    return user.emails[0].address;
  }
};
