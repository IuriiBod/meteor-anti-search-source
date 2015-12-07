var component = FlowComponents.define('basics', function (props) {
  this.supplierId = props.id;
});

component.prototype.updateSupplier = function (field, value) {
  var supplier = this.get('supplier');
  supplier[field] = value;
  Meteor.call('editSupplier', supplier, HospoHero.handleMethodResult());
};

component.state.supplier = function () {
  return Suppliers.findOne({_id: this.supplierId});
};

component.state.status = function () {
  var supplier = this.get('supplier');
  return supplier && supplier.active;
};

component.state.lastOrder = function () {
  return OrderReceipts.findOne({'supplier': this.supplierId}, {sort: {'date': -1}});
};

component.state.deliveryDays = function () {
  return [
    {value: 'monday', text: 'Monday'},
    {value: 'tuesday', text: 'Tuesday'},
    {value: 'wednesday', text: 'Wednesday'},
    {value: 'thursday', text: 'Thursday'},
    {value: 'friday', text: 'Friday'},
    {value: 'saturday', text: 'Saturday'},
    {value: 'sunday', text: 'Sunday'}
  ];
};

component.state.isSelectedDay = function (value) {
  var supplier = this.get('supplier');
  return supplier && supplier.deliveryDays.indexOf(value) > -1;
};

component.action.changeSupplierStatus = function () {
  Meteor.call('activateReactivateSuppliers', this.supplierId, HospoHero.handleMethodResult(function () {
    Router.go('suppliersList');
  }));
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
  this.updateSupplier(field, value);
};