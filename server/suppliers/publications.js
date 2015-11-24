Meteor.publish('allSuppliers', function (areaId) {
  if (this.userId) {
    logger.info('All suppliers have been published');
    return Suppliers.find({'relations.areaId': areaId});
  }
});

Meteor.publish("suppliers", function (ids) {
  logger.info("Suppliers have been published", ids);
  return Suppliers.find({"_id": {$in: ids}, "relations.areaId": HospoHero.getCurrentAreaId(this.userId)});
});

Meteor.publish("supplierProfile", function (id) {
  return [
    Suppliers.find(id),
    Ingredients.find({"suppliers": id}),
    OrderReceipts.find({"supplier": id})
  ];
});