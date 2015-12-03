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

component.action.getThisSupplier = function () {
  return this.get('supplier');
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
        var urlArray = [];
        blobs.forEach(function (doc) {
          var file = {
            url: doc.url,
            name: doc.filename,
            uploadedAt: new Date()
          };
          urlArray.push(file);
        });
        Meteor.call('addPriceList', self.supplierId, urlArray, HospoHero.handleMethodResult());
      }
    }, function (error) {
      if (error) {
        console.log(error);
      }
    }
  );
};