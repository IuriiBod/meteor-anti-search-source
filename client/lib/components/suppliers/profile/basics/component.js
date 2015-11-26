var component = FlowComponents.define('basics', function (props) {
    this.supplierId = props.id;
});

component.state.supplier = function () {
    return Suppliers.findOne({_id: this.supplierId});
}

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
    filepicker.pickAndStore({
            mimetype: 'application/pdf', services: ['COMPUTER']
        },
        {},
        function (InkBlobs) {
            var doc = (InkBlobs);
            if (doc) {
                var url = doc[0].url;
                Meteor.call('updateSupplier', self.get('supplier')._id, {'priceList': url},
                    HospoHero.handleMethodResult());
                return true;
            }
        }
    );
};