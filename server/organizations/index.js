Meteor.methods({
  //'createOrganization': function(orgName) {
  //  if(!HospoHero.isManager()) {
  //    logger.error("User not permitted to create organizations");
  //    throw new Meteor.Error(403, "User not permitted to create organization");
  //  }
  //
  //  if(Organizations.find({name: orgName}).count() > 0) {
  //    throw new Meteor.Error("Organization with the same name already exists!");
  //  }
  //
  //  // Create organization
  //  var orgId = Organizations.insert({
  //    name: orgName,
  //    owner: Meteor.userId(),
  //    createdAt: Date.now()
  //  });
  //
  //  // Create relations between user and organization
  //  Meteor.users.update({_id: Meteor.userId()}, {
  //    $set: {
  //      relations: {
  //        organizationId: orgId,
  //        locationIds: null,
  //        areaIds: null
  //      }
  //    }
  //  });
  //  return true;
  //},

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

    //updating user in Meteor.users collection requires user id
    var organizationOwnerId = Meteor.userId();
    var usersIdsRelatedToOrganization = Meteor.users
        .find({'relations.organizationId': organizationId}, {fields: {_id: 1}})
        .map(function (user) { return user._id });

    usersIdsRelatedToOrganization.forEach(function(userId) {
      if (userId !== organizationOwnerId) {
        Meteor.users.remove({_id: userId});
      }
    });

    var locationsIdsRelatedToOrganization = Locations
        .find({organizationId: organizationId}, {fields: {_id: 1}})
        .map(function (location) { return location._id; });

    locationsIdsRelatedToOrganization.forEach( function (id) {
      Meteor.call('deleteLocation', id);
    });

    Meteor.users.update({
      _id: organizationOwnerId
    },{
      $set: {'relations.organizationId': null}
    });

    Organizations.remove({_id: organizationId});
    logger.info('Organization was deleted', {organizationId: organizationId});
  }
});