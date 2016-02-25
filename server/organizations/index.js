Meteor.methods({
  createOrganization: function (organizationName) {
    check(organizationName, String);

    if (!this.userId) {
      const errorMsg = "You are not permitted to create organizations";
      throw new Meteor.Error(403, errorMsg);
    }

    organizationName = organizationName.trim();
    let escapedOrganizationName = HospoHero.misc.escapeRegExpString(organizationName);
    let organizationNameReg = new RegExp(escapedOrganizationName, 'i');
    if (!!Organizations.findOne({name: organizationNameReg})) {
      throw new Meteor.Error("Organization with the same name already exists!");
    }

    // Create organization
    var orgId = Organizations.insert({
      name: organizationName,
      owners: [Meteor.userId()],
      createdAt: Date.now()
    });

    // Create relations between user and organization
    Meteor.users.update({_id: Meteor.userId()}, {
      $addToSet: {'relations.organizationIds': orgId}
    });

    return true;
  },

  deleteOrganization: function (organizationId) {
    check(organizationId, HospoHero.checkers.MongoId);

    let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);
    if (!permissionChecker.isOrganizationOwner(organizationId)) {
      logger.error("User not permitted to delete organization");
      throw new Meteor.Error(403, "User not permitted to delete organization");
    }

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
    }, {
      multi: true
    });

    Organizations.remove({_id: organizationId});
    logger.info('Organization was deleted', {organizationId: organizationId});
  }
});