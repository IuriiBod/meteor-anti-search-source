Template.supplierFilter.onRendered(function () {
  this.generateReceipts = function (orderType) {
    FlowComponents.callAction('getSupplier').then(function (supplier) {
      var version = HospoHero.getParamsFromRoute(Router.current(), '_id');
      var address = null;
      var deliveryDate = moment().add(1, 'days').format('x');
      var info = {
        "through": orderType,
        "details": address,
        "deliveryDate": deliveryDate
      };
      if (orderType == "emailed") {
        $("#composeMailModal").modal();
      } else {
        Meteor.call("generateReceipts", version, supplier, info, HospoHero.handleMethodResult());
      }
    });
  }
});

Template.supplierFilter.events({
  'click .activateSupplier': function (event) {
    event.preventDefault();
    FlowComponents.callAction('setActiveSupplier', this.toString());
  },

  'click .orderEmailed': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('emailed');
  },

  'click .orderPhoned': function (event, tmpl) {
    event.preventDefault();
    tmpl.generateReceipts('phoned');
  }
});