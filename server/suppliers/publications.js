Meteor.publish("allSuppliers", function() {
  var cursors = [];
  cursors.push(Suppliers.find());  
  logger.info("All suppliers have been published");
  return cursors;
});

Meteor.publish("suppliers", function(ids) {
  var cursors = [];
  cursors.push(Suppliers.find({"_id": {$in: ids}}));  
  logger.info("Suppliers have been published", ids);
  return cursors;
});

Meteor.publish("supplierProfile", function(id) {
  var cursors = [];
  cursors.push(Suppliers.find(id));
  cursors.push(Ingredients.find({"suppliers": id}));
  cursors.push(OrderReceipts.find({"supplier": id}));
  return cursors;
});