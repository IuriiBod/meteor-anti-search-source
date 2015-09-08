Meteor.publish("getAllRelations", function() {
  logger.info("All relations published");
  return Relations.find();
});

Meteor.publish("getUsersRelations", function() {
  logger.info("All user's relations published");
  return Relations.find({collectionName: "users"});
});