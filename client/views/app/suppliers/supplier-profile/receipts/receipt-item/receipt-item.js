Template.receiptItem.onCreated(function () {
  this.set('receipt', this.data.receipt);
});

Template.receiptItem.helpers({
  received: function () {
    var receipt = this.receipt;
    return receipt && receipt.received;
  },
  pending: function () {
    var receipt = this.receipt;
    return receipt && !receipt.received && receipt.orderPlacedBy;
  }
});