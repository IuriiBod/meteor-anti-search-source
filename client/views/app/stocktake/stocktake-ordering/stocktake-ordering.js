Template.stocktakeOrdering.onCreated(function () {
  this.set('activeSupplierId', null);
});

Template.stocktakeOrdering.helpers({
  isNotEmpty: function () {
    return !!OrderItems.findOne({
      version: this.stocktakeMainId
    });
  },

  stockOrdersList: function (activeSupplierId) {
    return OrderItems.find({
      version: this.stocktakeMainId,
      supplier: activeSupplierId
    });
  },

  orderNote: function (activeSupplierId) {
    var data = Orders.findOne({
      version: this.stocktakeMainId,
      supplier: activeSupplierId
    });

    return data && data.orderNote;
  },

  onSupplierChanged: function () {
    var tmpl = Template.instance();
    return function (supplierId) {
      tmpl.set('activeSupplierId', supplierId);
    };
  }
});

Template.stocktakeOrdering.events({
  'keyup .supplier-order-note': function (event, tmpl) {
    event.preventDefault();
    if (event.keyCode === 13) {
      var noteText = tmpl.$(event.target).val().trim();

      if (noteText.length > 0) {
        var activeSupplierId = tmpl.get('activeSupplierId');
        var version = tmpl.data.stocktakeMainId;

        var receipt = Orders.findOne({supplier: activeSupplierId, version: version});

        if (receipt) {
          var info = {
            orderNote: noteText,
            version: version,
            supplier: activeSupplierId
          };

          Meteor.call("updateReceipt", receipt._id, info, HospoHero.handleMethodResult());
        }
      }
    }
  }
});