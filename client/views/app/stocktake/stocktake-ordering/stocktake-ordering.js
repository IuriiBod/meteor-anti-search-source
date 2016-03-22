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

  orderItems: function (activeOrder) {
    return OrderItems.find({orderId: activeOrder._id});
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
  },

  isOrderEditable: function (order) {
    return !order.orderedThrough;
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