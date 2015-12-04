var component = FlowComponents.define("ordersList", function (props) {
  this.set('version', HospoHero.getParamsFromRoute(Router.current(), '_id'));
});

component.state.isNull = function () {
  var data = StockOrders.find({
    "version": this.get('version')
  }).fetch();
  return !!(data && data.length > 0);
};

component.state.list = function () {
  var data = StockOrders.find({
    "version": this.get('version'),
    "supplier": this.get("activeSupplier")
  }).fetch();
  var orderIds = _.map(data, function (doc) {
    return doc._id;
  });
  return orderIds;
};

component.state.supplier = function () {
  return this.get("activeSupplier");
};

component.state.orderNote = function () {
  var data = OrderReceipts.findOne({
    "version": this.get('version'),
    "supplier": this.get("activeSupplier")
  });
  if (data && data.orderNote) {
    return data.orderNote;
  }
};

component.state.onSupplierChanged = function () {
  var self = this;
  return function (supplierId) {
    self.set('activeSupplier', supplierId);
  }
};