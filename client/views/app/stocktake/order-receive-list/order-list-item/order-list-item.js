Template.orderListItem.helpers({
  isInvoiceUploaded() {
    return this.hasOwnProperty('invoiceImage');
  },

  orderTotals() {
    let ordered = 0;
    let received = 0;

    OrderItems.find({orderId: this._id}).forEach(function (order) {
      let countOrdered = order.orderedCount || 0;
      let countReceived = order.receivedCount || 0;
      ordered += countOrdered * order.ingredient.cost;
      received += countReceived * order.ingredient.cost;
    });
    return {ordered, received};
  }
});

Template.orderListItem.events({
  'click .receive-delivery': function (event) {
    event.preventDefault();

    if (this._id) {
      Router.go("orderReceive", {_id: this._id});
    }
  }
});