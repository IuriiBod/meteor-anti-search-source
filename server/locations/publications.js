Meteor.publish("getAllLocations", function(organizationId) {
  logger.info("Locations of organization " + organizationId + " published");
  return Locations.find({organizationId: organizationId});
});

Meteor.publish("getLocation", function (locationId) {
  logger.info("Location " + locationId + " published");
  return Locations.find({_id: locationId});
});