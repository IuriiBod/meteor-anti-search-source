// Publishing organization and all what depends on it
Meteor.publishComposite('organizationInfo', function (userProfile) {
  logger.info('Organization info subscription');

  let user = this.userId && userProfile;

  if (user) {
    let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);
    let isOrganizationOwner = (organization) => permissionChecker.isOrganizationOwner(organization._id);

    let findNotifications = function () {
      return Notifications.find({
        to: this.userId
      });
    };

    let findOrganizations = function () {
      let query = {};

      if (!permissionChecker._isSuperUser()) {
        query = {
          $or: [{owners: user._id}]
        };

        if (user.relations) {
          query.$or.push({_id: {$in: user.relations.organizationIds}});
        }
      }

      return Organizations.find(query, {
        fields: {
          name: 1,
          owners: 1
        }
      });
    };

    let findRoles = function (organization) {
      return Meteor.roles.find({
        $or: [
          {'default': true},
          {"relations.organizationId": organization._id}
        ]
      });
    };

    let findLocations = function (organization) {
      let query = {
        organizationId: organization._id,
        archived: {$ne: true}
      };

      if (!isOrganizationOwner(organization)) {
        // in case user isn't organization owner
        query._id = {$in: user.relations.locationIds};
      }

      return Locations.find(query, {
        fields: {
          name: 1,
          organizationId: 1,
          timezone: 1
        }
      });
    };

    let findAreas = function (location, organization) {
      let query = {
        locationId: location._id,
        archived: {$ne: true}
      };

      if (!isOrganizationOwner(organization)) {
        query._id = {$in: user.relations.areaIds};
      }

      return Areas.find(query, {
        fields: {
          name: 1,
          locationId: 1,
          organizationId: 1,
          color: 1,
          archived: 1,
          inactivityTimeout: 1
        }
      });
    };

    return [
      {
        // Publishing notifications for current user
        find: findNotifications
      },
      {
        // Publishing current organization
        find: findOrganizations,
        children: [
          {
            // Publishing organization roles
            find: findRoles
          },
          {
            // Publishing locations of organization
            find: findLocations,
            children: [
              {
                // Publishing areas of locations
                find: findAreas
              }
            ]
          }
        ]
      }
    ];
  } else {
    this.ready();
  }
});