Template.suppliersFilter.onRendered(function () {
  this.$('.suppliers-filter-select').select2();
});


Template.suppliersFilter.helpers({
  suppliers() {
    return Suppliers.find({});
  }
});


Template.suppliersFilter.events({
  'change .suppliers-filter-select': function (event, tmpl) {
    event.preventDefault();

    if (_.isFunction(tmpl.data.onSupplierChanged)) {
      let supplierId = event.target.value;

      supplierId = supplierId === 'All Suppliers' ? null : supplierId;
      tmpl.data.onSupplierChanged(supplierId);
    }
  }
});


Template.suppliersFilter.onDestroyed(function () {
  this.$('.suppliers-filter-select').select2('destroy');
});