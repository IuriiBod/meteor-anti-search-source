var user;
var role;

// Publishing current user
Meteor.publish(null, function() {
  if(this.userId) {
    user = Meteor.users.findOne(this.userId);

    if(user) {
      // Finding the user's role name
      if(user.roles && user.roles.defaultRole) {
        if(Organizations.findOne({ owner: this.userId })) {
          role = 'owner';
        }
      } else if (user.roles && user.currentAreaId) {
        var userRole = Meteor.roles.findOne(user.roles[user.currentAreaId]);
        if(userRole) {
          role = userRole.name == 'Owner' ? 'owner' : userRole.name == 'Manager' ? 'manager' : 'worker';
        }
      }

      var fields = {
        "services.google": 1,
        profile: 1,
        username: 1,
        emails: 1,
        isActive: 1,
        relations: 1,
        createdAt: 1,
        currentAreaId: 1,
        roles: 1
      };

      return Meteor.users.find({
      _id: this.userId
      }, {
        fields: fields
      });
    }
  } else {
    this.ready();
  }
});


// Publishing organization and all what depends on it
Meteor.publishComposite('organizationInfo', {
  // Publishing current organization
  find: function() {
    if(this.userId) {
      user = Meteor.users.findOne(this.userId);
      if(user.relations && user.relations.organizationId) {
        var fields = {};

        if(role == 'worker' || role == 'manager') {
          fields.name = 1;
        }

        return Organizations.find({
          _id: user.relations.organizationId
        }, {
          fields: fields
        });
      } else {
        this.ready();
      }
    } else {
      this.ready();
    }
  },
  children: [
    {
      // Publishing organization roles
      find: function(organization) {
        return Meteor.roles.find({
          $or: [
            { 'default': true },
            { "relations.organizationId": organization._id }
          ]
        });
      }
    },
    {
      // Publishing locations of organization
      find: function(organization) {
        if(user && user.relations && user.relations.locationIds) {
          var fields = {};
          var query = {
            organizationId: organization._id,
            archived: { $ne: true }
          };

          if(role == 'manager' || role == 'worker') {
            query._id = {$in: user.relations.locationIds};
            if (role == 'worker') {
              fields.name = 1;
              fields.organizationId = 1;
            }
          }
          return Locations.find(query, { fields: fields });
        } else {
          this.ready();
        }
      },
      children: [
        {
          // Publishing areas of locations
          find: function(location) {
            if(user && user.relations && user.relations.areaIds) {
              var fields = {};
              var query = {
                locationId: location._id,
                archived: { $ne: true }
              };

              if(role == 'worker') {
                fields.name = 1;
                fields.locationId = 1;
                fields.organizationId = 1;
                query._id = { $in: user.relations.areaIds };
              }

              return Areas.find(query, { fields: fields });
            } else {
              this.ready();
            }
          }
        }
      ]
    },
    {
      // Publishing users of current area
      find: function(organization) {
        if(user && user.currentAreaId) {
          return Meteor.users.find({
            isActive: true,
            $or: [
              { "relations.areaIds": user.currentAreaId },
              {
                "relations.organizationId": organization._id,
                "relations.locationIds": null,
                "relations.areaIds": null
              }
            ]
          }, {
            fields: {
              username: 1,
              "services.google.picture": 1,
              profile: 1,
              relations: 1
            }
          });
        }
      }
    },
    {
      // Publishing notifications of current area
      find: function() {
        if(user && user.currentAreaId) {
          return Notifications.find({
            "relations.areaId": user.currentAreaId
          });
        }
      }
    }
  ]
});