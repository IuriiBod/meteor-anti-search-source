Template.supplierFilter.events({
  'click .activateSupplier': function(event) {
    event.preventDefault();
    var supplier = $(event.target).attr("data-id");
    if(supplier == "Non-assigned") {
      supplier = null;
    }
    Session.set("activeSupplier", supplier);
  },

  'click .setOrder': function(event) {
    event.preventDefault();
    var orderType = $(event.target).attr("data-type");
    var supplier = Session.get("activeSupplier");
    var version = Session.get("thisVersion");
    var address = null;
    var deliveryDate = moment().add(1, 'days');
    deliveryDate = moment(deliveryDate).format("YYYY-MM-DD");
    var info = {
      "through": orderType,
      "details": address,
      "deliveryDate": new Date(deliveryDate).getTime()
    };
    if(orderType == "emailed") {
      $("#composeMailModal").modal();
    } else {
      Meteor.call("generateReceipts", version, supplier, info, HospoHero.handleMethodResult());
    }
  }
});