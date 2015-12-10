//var component = FlowComponents.define("ordersList", function (props) {
//  this.set('version', HospoHero.getParamsFromRoute(Router.current(), '_id'));
//});

//component.state.isNull = function () {
//  var data = StockOrders.find({
//    "version": this.get('version')
//  }).fetch();
//  return !!(data && data.length > 0);
//};
//
//component.state.list = function () {
//  var data = StockOrders.find({
//    "version": this.get('version'),
//    "supplier": this.get("activeSupplier")
//  }).fetch();
//  return _.map(data, function (doc) {
//    return doc._id;
//  });
//};
//
//component.state.supplier = function () {
//  console.log('this.get("activeSupplier") => ', this.get("activeSupplier"));
//  return this.get("activeSupplier");
//};
//
//component.state.orderNote = function () {
//  var data = OrderReceipts.findOne({
//    "version": this.get('version'),
//    "supplier": this.get("activeSupplier")
//  });
//  if (data && data.orderNote) {
//    return data.orderNote;
//  }
//};
//
//component.state.onSupplierChanged = function () {
//  var self = this;
//  return function (supplierId) {
//    self.set('activeSupplier', supplierId);
//    self.getInitialHtml(supplierId);
//  }
//};
//
//component.state.onCountChange = function () {
//  var self = this;
//  return function () {
//    self.getInitialHtml(self.get('activeSupplier'));
//  }
//};
//
//
//component.action.getSupplier = function () {
//  return this.get('supplier');
//};

//component.prototype.getInitialHtml = function (supplierId) {
//  var supplier = Suppliers.findOne(supplierId);
//
//  if (supplier) {
//    var receipt = OrderReceipts.findOne({"version": this.get("version"), "supplier": supplierId});
//    var total = 0;
//
//    var data = StockOrders.find({
//      "version": this.get("version"),
//      "supplier": supplierId,
//      "relations.areaId": HospoHero.getCurrentAreaId(),
//      "countOrdered": {$gt: 0}
//    }, {
//      fields: {
//        countOrdered: 1,
//        unit: 1,
//        stockId: 1,
//        unitPrice: 1
//      }
//    }).fetch();
//
//    data = _.map(data, function (stock) {
//      var stockItem = Ingredients.findOne({_id: stock.stockId}, {fields: {code: 1, description: 1}});
//      var cost = stock.countOrdered * stock.unitPrice;
//      stockItem.cost = cost;
//
//      total += cost;
//
//      return _.extend(stock, stockItem);
//    });
//
//    var area = HospoHero.getCurrentArea();
//    var location = Locations.findOne({_id: area.locationId});
//
//    var deliveryDate = receipt && receipt.expectedDeliveryDate ? receipt.expectedDeliveryDate : moment().add(1, 'day');
//
//    var user = {
//      name: HospoHero.username(Meteor.userId()),
//      type: HospoHero.roles.getUserRoleName(Meteor.userId(), HospoHero.getCurrentAreaId())
//    };
//
//    var templateData = {
//      supplierName: supplier.name,
//      deliveryDate: HospoHero.dateUtils.dateFormat(deliveryDate),
//      orederNote: receipt && receipt.orderNote || '',
//      location: location,
//      areaName: area.name,
//      orderData: data,
//      total: total,
//      user: user
//    };
//
//    var self = this;
//    Meteor.call('renderSomeHandlebarsTemplate', 'supplier-email-text', templateData, HospoHero.handleMethodResult(function (text) {
//      console.log('text after Meteor call => ', text);
//      self.set('initialHtml', text);
//    }));
//  } else {
//    this.set('initialHtml', '');
//  }
//};