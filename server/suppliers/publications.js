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
    Ingredients.find({"suppliers": id}),
    OrderReceipts.find({"supplier": id})
  ];
});

Meteor.publishAuthorized('suppliersNamesList', function (areaId) {
  return Suppliers.find({'relations.areaId': areaId}, {fields: {_id: 1, name: 1}});
});