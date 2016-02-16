Meteor.methods({
  createOrganization: function (orgName) {
    if (!HospoHero.isManager()) {
      logger.error("User not permitted to create organizations");
      throw new Meteor.Error(403, "User not permitted to create organization");
    }

    if (Organizations.find({name: orgName}).count() > 0) {
      throw new Meteor.Error("Organization with the same name already exists!");
    }

    // Create organization
    var orgId = Organizations.insert({
      name: orgName,
      owners: [Meteor.userId()],
      createdAt: Date.now()
    });

    // Create relations between user and organization
    Meteor.users.update({_id: Meteor.userId()}, {
      $set: {
        relations: {
          organizationIds: [orgId]
        }
      }
    });
    return true;
  },

  deleteOrganization: function (organizationId) {
    if (!Meteor.user()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if (!HospoHero.isOrganizationOwner()) {
      logger.error("User not permitted to delete organization");
      throw new Meteor.Error(403, "User not permitted to delete organization");
    }

    check(organizationId, HospoHero.checkers.MongoId);

    Locations.find({organizationId: organizationId}, {
      fields: {_id: 1}
    }).forEach(function (location) {
      Meteor.call('deleteLocation', location._id);
    });

    //remove organization's members from it
    let organizationMembersIds = Meteor.users.find({
      'relations.organizationIds': organizationId
    }, {
      fields: {_id: 1}
    }).map(user => user._id);

    Meteor.users.update({_id: {$in: organizationMembersIds}}, {
      $pull: {'relations.organizationIds': organizationId}
    },{
      multi: true
    });

    Organizations.remove({_id: organizationId});
    logger.info('Organization was deleted', {organizationId: organizationId});
  }
});