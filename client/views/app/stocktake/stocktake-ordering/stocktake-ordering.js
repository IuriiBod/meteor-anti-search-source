Template.stocktakeOrdering.onCreated(function () {
  this.activeSupplierId = new ReactiveVar(false);
});

Template.stocktakeOrdering.helpers({
  activeSupplierId: function () {
    return Template.instance().activeSupplierId.get();
  },

  isNotEmpty: function () {
    return !!OrderItems.findOne({});
  },

  stockOrdersList: function (activeSupplierId) {
    return OrderItems.find({supplierId: activeSupplierId});
  },

  orderNote: function (activeSupplierId) {
    var currentOrder = Orders.findOne({
      supplierId: activeSupplierId
    });

    return currentOrder && currentOrder.orderNote;
  },

  onSupplierChanged: function () {
    var tmpl = Template.instance();
    return function (supplierId) {
      tmpl.activeSupplierId.set(supplierId);
    };
  }
});

Template.stocktakeOrdering.events({
  'keyup .supplier-order-note': function (event, tmpl) {
    event.preventDefault();
    if (event.keyCode === 13) {
      let noteText = tmpl.$(event.target).val().trim();

      if (noteText.length > 0) {
        let activeSupplierId = tmpl.activeSupplierId.get();
        let currentOrder = Orders.findOne({supplierId: activeSupplierId});

        currentOrder.orderNote = noteText;

        Meteor.call('updateOrder', currentOrder, HospoHero.handleMethodResult());
      }
    }
  }
});