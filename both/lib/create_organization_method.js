Meteor.methods({
  'createOrganization': function (orgName) {
    if(Meteor.isSimulating) {
      if (!HospoHero.isManager()) {
        logger.error("User not permitted to create organizations");
        throw new Meteor.Error(403, "User not permitted to create organization");
      }

      if (Organizations.find({name: orgName}).count() > 0) {
        throw new Meteor.Error("Organization with the same name already exists!");
      }
    }

    // Create organization
    var orgId = Organizations.insert({
      name: orgName,
      owner: Meteor.userId(),
      createdAt: Date.now()
    });

    // Create relations between user and organization
    Meteor.users.update({_id: Meteor.userId()}, {
      $set: {
        relations: {
          organizationId: orgId,
          locationIds: null,
          areaIds: null
        }
      }
    });
    return true;
  }
});