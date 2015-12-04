Template.supplierFilter.events({
  'click .activateSupplier': function(event) {
    event.preventDefault();
    FlowComponents.callAction('setActiveSupplier', this.toString());
  },

  'click .setOrder': function(event) {
    event.preventDefault();
    FlowComponents.callAction('getSupplier').then(function(supplier) {
      var orderType = $(event.target).attr("data-type");
      var version = HospoHero.getParamsFromRoute(Router.current(), '_id');
      var address = null;
      var deliveryDate = moment().add(1, 'days').format('x');
      deliveryDate = moment(deliveryDate).format("YYYY-MM-DD");
      var info = {
        "through": orderType,
        "details": address,
        "deliveryDate": deliveryDate
      };
      if(orderType == "emailed") {
        $("#composeMailModal").modal();
      } else {
        Meteor.call("generateReceipts", version, supplier, info, HospoHero.handleMethodResult());
      }
    });
  }
});