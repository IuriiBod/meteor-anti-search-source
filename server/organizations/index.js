Meteor.methods({
  'createOrganization': function(org) {
    var user = Meteor.user();

    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }

    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    if(!org.name) {
      logger.error("Organization should have a name");
      throw new Meteor.Error(404, "Organization should have a name");
    }

    // TODO: Check billing account here

    var doc = {
      name: org.name,
      createdAt: Date.now()
    };

    // Create organization
    var orgID = Organizations.insert(doc);

    // Create relations between user and organization
    Relations.insert({
      organizationId: orgID,
      locationIds: null,
      areaIds: null,
      entityId: user._id,
      collectionName: "users"
    });

    return orgID;
  }
});