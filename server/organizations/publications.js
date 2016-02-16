// Publishing organization and all what depends on it
Meteor.publishComposite('organizationInfo', function () {
  logger.info('Organization info subscription');

  console.log('Organization info subscription');

  var user = this.userId && Meteor.users.findOne(this.userId);

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
          if (user.relations && user.relations.organizationIds) {
            return Organizations.find({
              _id: {$in: user.relations.organizationIds}
            }, {
              fields: {
                name: 1,
                owners: 1
              }
            });
          } else {
            this.ready();
          }
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
              if (user.relations.locationIds) {
                return Locations.find({
                  _id: {$in: user.relations.locationIds},
                  organizationId: organization._id,
                  archived: {$ne: true}
                }, {
                  fields: {
                    name: 1,
                    organizationId: 1,
                    timezone: 1
                  }
                });
              } else {
                this.ready()
              }
            },
            children: [
              {
                // Publishing areas of locations
                find: function (location) {
                  return Areas.find({
                    _id: {$in: user.relations.areaIds},
                    locationId: location._id,
                    archived: {$ne: true}
                  }, {
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