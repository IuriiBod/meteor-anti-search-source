Meteor.publish("getAllLocations", function(id) {
  logger.info("Locations of organization "+id+" published");
  return Locations.find({organizationId: id});
});