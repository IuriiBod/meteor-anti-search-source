Meteor.publishAuthorized('allSuppliers', function (areaId) {
  logger.info('All suppliers have been published');
  return Suppliers.find({'relations.areaId': areaId});
});

Meteor.publishAuthorized("suppliers", function (ids) {
  logger.info("Suppliers have been published", ids);
  return Suppliers.find({"_id": {$in: ids}, "relations.areaId": HospoHero.getCurrentAreaId(this.userId)});
});

Meteor.publishAuthorized("supplierProfile", function (id) {
  return [
    Suppliers.find(id),
    Ingredients.find({suppliers: id}),
    Orders.find({supplierId: id})
  ];
});

Meteor.publishAuthorized('suppliersNamesList', function (areaId) {
  let checkPermission = new HospoHero.security.PermissionChecker(this.userId);
  if (checkPermission.hasPermissionInArea(areaId, "view area reports")) {
    return Suppliers.find({'relations.areaId': areaId}, {fields: {_id: 1, name: 1}});
  } else {
    this.ready();
  }
});