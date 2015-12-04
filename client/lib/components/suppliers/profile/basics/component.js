var component = FlowComponents.define('basics', function (props) {
  this.supplierId = props.id;
});

component.state.supplier = function () {
  return Suppliers.findOne({_id: this.supplierId});
};

component.state.status = function () {
  return this.get('supplier').active;
};

component.state.lastOrder = function () {
  return OrderReceipts.findOne({'supplier': this.get('supplier')._id}, {sort: {'date': -1}, limit: 1});
};

component.action.changeSupplierStatus = function () {
  var id = this.get('supplier').id;
  Meteor.call('activateReactivateSuppliers', id, HospoHero.handleMethodResult());
};

component.action.uploadPriceList = function () {
  var self = this;
  filepicker.pickMultiple({
    services: ['COMPUTER']
  }, function (blobs) {
    if (_.isArray(blobs)) {
      var urlArray = _.map(blobs, function (doc) {
        return {
          url: doc.url,
          name: doc.filename,
          uploadedAt: new Date()
        };
      });
      Meteor.call('addPriceList', self.supplierId, urlArray, HospoHero.handleMethodResult());
    }
  }, HospoHero.handleMethodResult());
};

component.action.removePriceList = function (priceListObject) {
  Meteor.call('removePriceList', this.supplierId, priceListObject, HospoHero.handleMethodResult());
};

component.action.updateSupplier = function (field, value) {
  var supplier = this.get('supplier');
  supplier[field] = value;
  Meteor.call('editSupplier', supplier, HospoHero.handleMethodResult());
};