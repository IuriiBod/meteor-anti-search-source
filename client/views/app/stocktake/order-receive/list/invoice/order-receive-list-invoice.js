Template.invoiceImage.helpers({
  imageUrl: function() {
    var receipt = OrderReceipts.findOne({_id: this.id});
    return receipt && receipt.invoiceImage;
  }
});