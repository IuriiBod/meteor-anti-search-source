Meteor.publish("getAllLocations", function(id) {
  logger.info("Locations of organization "+id+" published");
  return Locations.find({organizationId: id});
});

Meteor.publish("getLocation", function (id) {
  logger.info("Location "+id+" published");
  return Locations.find({_id: id});
})