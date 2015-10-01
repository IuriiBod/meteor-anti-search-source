Meteor.publish("allSuppliers", function() {
  if(this.userId) {
    logger.info("All suppliers have been published");
    return Suppliers.find({ "relations.areaId": HospoHero.currentArea(this.userId) });
  }
});

Meteor.publish("suppliers", function(ids) {
  logger.info("Suppliers have been published", ids);
  return Suppliers.find({"_id": {$in: ids}});
});

Meteor.publish("supplierProfile", function(id) {
  return [
    Suppliers.find(id),
    Ingredients.find({"suppliers": id}),
    OrderReceipts.find({"supplier": id})
  ];
});