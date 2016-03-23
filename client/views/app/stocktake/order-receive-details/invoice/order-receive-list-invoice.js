Template.invoiceImage.helpers({
  imageUrl: function() {
    var receipt = Orders.findOne({_id: this.id});
    return receipt && receipt.invoiceImage;
  }
});