Template.supplierFilter.events({
  'click .activateSupplier': function(event) {
    event.preventDefault();
    var supplier = $(event.target).attr("data-id");
    Session.set("activeSupplier", supplier);
  },

  'click .setOrder': function(event) {
    event.preventDefault();
    var orderType = $(event.target).attr("data-type");
    var supplier = Session.get("activeSupplier");
    var stocktakeDate = Session.get("thisDate");
    var address = null;
    var deliveryDate = moment().add(7, 'days');
    deliveryDate = moment(deliveryDate).format("YYYY-MM-DD");
    var info = {
      "through": orderType,
      "details": address,
      "deliveryDate": new Date(deliveryDate).getTime()
    }
    Meteor.call("generateReceipts", stocktakeDate, supplier, info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .orderByPhone': function(event) {
    event.preventDefault();
    var supplier = Session.get("activeSupplier");
    var stocktakeDate = Session.get("thisDate");
    console.log("........order by phone", supplier, stocktakeDate);
    Meteor.call("generateReceipts", stocktakeDate, supplier, "phone", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});