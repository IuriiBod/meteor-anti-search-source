Template.receiptsList.helpers({
  receipts: function () {
    return Orders.find({
      supplier: this.id
    }, {
      sort: {
        receivedDate: -1
      }
    });
  }
});