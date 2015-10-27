Template.ordersList.events({
  'click .gotoStocktake': function(event) {
    event.preventDefault();
    var id = Session.get("thisVersion");
    Router.go("stocktakeCounting", {"_id": id});
  },

  'keyup #supplierOrderNote': function(event) {
    event.preventDefault();
    if(event.keyCode == 13) {
      var supplier = Session.get("activeSupplier");
      var version = Session.get("thisVersion");
      var text = $(event.target).val();
      var id = null;
      var receipt = OrderReceipts.findOne({"supplier": supplier, "version": version});
      var info = {
        "orderNote": text.trim(),
        "version": version,
        "supplier": supplier
      };
      if(receipt) {
        id = receipt._id;
      }
      
      Meteor.call("updateReceipt", id, info, HospoHero.handleMethodResult());
    }
  }
});