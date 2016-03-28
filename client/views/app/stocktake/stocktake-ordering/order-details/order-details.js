Template.orderDetails.helpers({
  isOrderEditable: function () {
    return !this.orderedThrough;
  },
  orderItems: function () {
    return OrderItems.find({orderId: this._id});
  }
});

Template.orderDetails.events({
  'keyup .supplier-order-note': function (event, tmpl) {
    event.preventDefault();
    if (event.keyCode === 13) {
      let noteText = tmpl.$(event.target).val().trim();

      if (noteText.length > 0) {
        let currentOrder = tmpl.data;
        currentOrder.orderNote = noteText;
        Meteor.call('updateOrder', currentOrder, HospoHero.handleMethodResult());
      }
    }
  }
});
