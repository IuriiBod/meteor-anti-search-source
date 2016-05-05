let ordersQueryOptions = {
  fields: {supplierId: 1}, sort: {supplier: 1}
};

Template.stocktakeOrderingSuppliersTags .onCreated(function () {
  var defaultOrder = Orders.findOne({
    stocktakeId: this.data.stocktakeId
  }, ordersQueryOptions);

  //default active supplier
  this.data.onSupplierChanged(defaultOrder.supplierId);
});


Template.stocktakeOrderingSuppliersTags .helpers({
  suppliers: function () {
    let ordersList = Orders.find({
      stocktakeId: this.stocktakeId
    }, ordersQueryOptions);

    let suppliersIds = ordersList.map(stockOrder => stockOrder.supplierId);

    return Suppliers.find({_id: {$in: suppliersIds}});
  },

  isOrderedThrough: function () {
    let order = Orders.findOne({
      supplierId: this._id
    });
    return order && order.orderedThrough;
  }
});


Template.stocktakeOrderingSuppliersTags .events({
  'click .activate-supplier-button': function (event, tmpl) {
    event.preventDefault();
    var supplier = Blaze.getData(event.target);
    tmpl.data.onSupplierChanged(supplier._id);
  }
});