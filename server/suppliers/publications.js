Meteor.publish("allSuppliers", function() {
  if(this.userId) {
    var query = {};

    var user = Meteor.users.findOne({_id: this.userId});
    if(user.defaultArea) {
      query["relations.areaId"] = user.defaultArea;
    }
    logger.info("All suppliers have been published");
    return Suppliers.find(query);
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