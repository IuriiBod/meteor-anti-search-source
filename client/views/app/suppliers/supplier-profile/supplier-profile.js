Template.supplierProfile.helpers({
  supplierId: function () {
    return HospoHero.getParamsFromRoute(Router.current(), '_id');
  }
});