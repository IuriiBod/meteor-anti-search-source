// Publishing organization and all what depends on it
Meteor.publishComposite('organizationInfo', function () {
  logger.info('Organization info subscription');

  let user = this.userId && Meteor.users.findOne(this.userId);
  let isOrganizationOwner = (organization) => organization.owners.indexOf(user._id) > -1;

  if (user) {
    let compositeConfig = [
      {
        // Publishing notifications for current user
        find: function () {
          return Notifications.find({
            to: this.userId
          });
        }
      },
      {
        // Publishing current organization
        find: function () {
          let query = {
            $or: [{owners: user._id}]
          };

          if (user.relations && user.relations.organizationIds) {
            query.$or.push({_id: {$in: user.relations.organizationIds}});
          }

          return Organizations.find(query, {
            fields: {
              name: 1,
              owners: 1
            }
          });
        },
        children: [
          {
            // Publishing organization roles
            find: function (organization) {
              return Meteor.roles.find({
                $or: [
                  {'default': true},
                  {"relations.organizationId": organization._id}
                ]
              });
            }
          },
          {
            // Publishing locations of organization
            find: function (organization) {
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
            },
            children: [
              {
                // Publishing areas of locations
                find: function (location, organization) {
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
                }
              }
            ]
          }
        ]
      }
    ];

    return compositeConfig;
  } else {
    this.ready();
  }
});