Meteor.methods({
  'createOrganization': function(doc) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to create organizations");
      throw new Meteor.Error(403, "User not permitted to create organization");
    }

    // TODO: Check billing account here

    doc.createdAt = Date.now();

    // Create organization
    var orgId = Organizations.insert(doc);

    // Create relations between user and organization
    Relations.insert({
      organizationId: orgId,
      locationIds: null,
      areaIds: null,
      entityId: user._id,
      collectionName: "users"
    });
    return orgId;
  },

  'deleteOrganization': function(id) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to delete organization");
      throw new Meteor.Error(403, "User not permitted to delete organization");
    }
    Areas.remove({organizationId: id});
    Locations.remove({organizationId: id});
    Relations.remove({organizationId: id});
    Organizations.remove({_id: id});

    // TODO: Write the code to delete remainder documents
  }
});