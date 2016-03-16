Template.supplierFilter.onCreated(function () {
  var stockOrder = OrderItems.findOne({
    version: this.data.stocktakeMainId
  }, {
    fields: {supplier: 1}, sort: {supplier: 1}
  });
  this.set('activeSupplierId', stockOrder.supplier);

  var tmpl = this;
  this.autorun(function () {
    var activeSupplierId = tmpl.get('activeSupplierId');
    tmpl.data.onSupplierChanged(activeSupplierId);
  });
});


Template.supplierFilter.helpers({
  suppliers: function () {
    var ordersList = OrderItems.find({
      version: this.stocktakeMainId
    }, {
      fields: {supplier: 1}, sort: {supplier: 1}
    });

    var suppliersIds = ordersList.map(function (stockOrder) {
      return stockOrder.supplier;
    });

    return Suppliers.find({_id: {$in: suppliersIds}});
  },

  receiptExists: function () {
    return !!OrderReceipts.findOne({
      version: Template.parentData(1).stocktakeMainId,
      supplier: this._id,
      'orderedThrough.through': {$ne: null}
    });
  }
});


Template.supplierFilter.events({
  'click .activate-supplier-button': function (event, tmpl) {
    event.preventDefault();
    var supplier = Blaze.getData(event.target);
    tmpl.set('activeSupplierId', supplier._id);
  }
});