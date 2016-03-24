Template.stocktakeOrdering.onCreated(function () {
  this.activeSupplierId = new ReactiveVar(false);
});

Template.stocktakeOrdering.helpers({
  activeSupplierId: function () {
    return Template.instance().activeSupplierId.get();
  },

  activeOrder: function () {
    let supplierId = Template.instance().activeSupplierId.get();
    return Orders.findOne({supplierId: supplierId, stocktakeId: this.stocktakeId});
  },

  isNotEmpty: function () {
    return !!Orders.findOne({stocktakeId: this.stocktakeId});
  },

  onSupplierChanged: function () {
    var tmpl = Template.instance();
    return function (supplierId) {
      tmpl.activeSupplierId.set(supplierId);
    };
  }
});

