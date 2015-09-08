Meteor.publish("getAllRelations", function() {
  return Relations.find();
});

Meteor.publish("getUsersRelations", function() {
  return Relations.find({collectionName: "users"});
});