Meteor.publish("getAllOrganizations", function () {
  return Organizations.find();
});