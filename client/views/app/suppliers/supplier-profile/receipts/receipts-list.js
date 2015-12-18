Template.receiptsList.helpers({
  receipts: function () {
    return OrderReceipts.find({
      supplier: this.id
    }, {
      sort: {
        receivedDate: -1
      }
    });
  }
});