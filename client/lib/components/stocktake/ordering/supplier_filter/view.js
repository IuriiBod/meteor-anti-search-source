Template.supplierFilter.events({
  'click .activateSupplier': function(event) {
    event.preventDefault();
    var supplier = $(event.target).attr("data-id");
    Session.set("activeSupplier", supplier);
  }
});