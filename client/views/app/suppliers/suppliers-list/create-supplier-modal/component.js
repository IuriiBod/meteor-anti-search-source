var component = FlowComponents.define("newSupplier", function (props) {
});

component.action.createSupplier = function (doc) {
  Meteor.call("createSupplier", doc, HospoHero.handleMethodResult(function (supplierId) {
    Router.go("supplierProfile", {"_id": supplierId});
  }));
};