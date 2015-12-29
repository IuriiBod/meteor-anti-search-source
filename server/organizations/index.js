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

  deleteOrganization: function (id) {
    var user = Meteor.user();
    if (!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if (!HospoHero.isOrganizationOwner()) {
      logger.error("User not permitted to delete organization");
      throw new Meteor.Error(403, "User not permitted to delete organization");
    }

    check(id, HospoHero.checkers.MongoId);

    var locationsIdsRelatedToOrganization = (function(id) {
      var ids = [];
      Locations.find(
          {organization: id},
          {fields: {_id: 1}}
      ).forEach(function (item) {ids.push(item._id)} );

      return ids;
    })(id);

    Meteor.call('removeLocations', locationsIdsRelatedToOrganization);

    Organizations.remove({_id: id});
    Meteor.call('removeAllDocumentsWithFieldValues', 'relations.organizationId', [id]);
  }
});