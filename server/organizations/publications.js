Meteor.publish("getAllOrganizations", function () {
  logger.info("All organizations published");
  return Organizations.find();
});

Meteor.publish("getOrganizationByUserId", function(id) {
  var organization = Relations.findOne({
    collectionName: "users",
    entityId: id
  });
  if(organization) {
    logger.info("Organization "+organization.organizationId+" published");
    return Organizations.find({_id: organization.organizationId});
  }
});

Meteor.publish('getOrganizationById', function(id) {
  return Organizations.find({_id: id});
});