Organizations.after.update(function (userId, newOrganization) {
  var oldOrganization = this.previous;

  var newOwners = newOrganization.owners;
  var oldOwners = oldOrganization.owners;

  if (newOwners.length !== oldOwners.length) {
    // Set to true if the new organization owner was added
    var isNewOwner = newOwners.length > oldOwners.length;

    var newRole;
    var differentOwner;

    if (isNewOwner) {
      newRole = Roles.getRoleByName('Owner');
      differentOwner = _.difference(newOwners, oldOwners)[0];
    } else {
      newRole = Roles.getRoleByName('Manager');
      differentOwner = _.difference(oldOwners, newOwners)[0];
    }

    var locationIds = Locations.find({organizationId: newOrganization._id}).map(function (location) {
      return location._id;
    });

    /**
     * Save the user role object in format:
     * {
     *   areaId: roleId,
     *   ...
     * }
     * @type {Object}
     */
    var newUserRoles = {};
    Areas.find({organizationId: newOrganization._id}).forEach(function (area) {
      newUserRoles[area._id] = newRole._id;
    });

    var areaIds = _.keys(newUserRoles);

    Meteor.users.update({
      _id: differentOwner
    }, {
      $set: {
        'relations.locationIds': locationIds,
        'relations.areaIds': areaIds,
        roles: newUserRoles
      }
    });
  }
});