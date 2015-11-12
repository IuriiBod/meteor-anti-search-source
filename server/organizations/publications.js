Meteor.publish('currentOrganization', function () {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    if (user.relations && user.relations.organizationId) {
      return Organizations.find({_id: user.relations.organizationId});
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});


// Publishing organization and all what depends on it
Meteor.publishComposite('organizationInfo', {
  // Publishing current organization
  find: function () {
    if (this.userId) {
      var user = Meteor.users.findOne(this.userId);
      if (user.relations && user.relations.organizationId) {
        var fields = {};

        if (!HospoHero.canUser('edit organization settings', this.userId)) {
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
      // Publishing notifications for current user
      find: function () {
        if (this.userId) {
          return Notifications.find({
            to: this.userId
          });
        } else {
          this.ready();
        }
      }
    },
    {
      // Publishing invitations fot current organization
      find: function (organization) {
        return Invitations.find({organizationId: organization._id});
      }
    },
    {
      // Publishing users of current organization
      find: function (organization) {
        if (this.userId && (HospoHero.canUser('edit areas', this.userId) || HospoHero.canUser('edit locations', this.userId))) {
          return Meteor.users.find({
            isActive: true,
            "relations.organizationId": organization._id
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
      // Publishing locations of organization
      find: function (organization) {
        if (this.userId) {
          var fields = {};
          var query = {
            organizationId: organization._id,
            archived: {$ne: true}
          };

          var user = Meteor.users.findOne(this.userId);
          if (user && user.relations && user.relations.locationIds) {
            query._id = {$in: user.relations.locationIds};
            if (!HospoHero.canUser('edit locations', this.userId)) {
              fields.name = 1;
              fields.organizationId = 1;
            }
          }
          return Locations.find(query, {fields: fields});
        } else {
          this.ready();
        }
      },
      children: [
        {
          // Publishing areas of locations
          find: function (location) {
            if (this.userId) {
              var fields = {};
              var query = {
                locationId: location._id,
                archived: {$ne: true}
              };

              var user = Meteor.users.findOne(this.userId);

              if (user && user.relations && user.relations.areaIds) {
                if (!HospoHero.canUser('edit areas', this.userId)) {
                  fields.name = 1;
                  fields.locationId = 1;
                  fields.organizationId = 1;
                  fields.color = 1;
                  fields.archived = 1;
                  query._id = {$in: user.relations.areaIds};
                }
              }
              return Areas.find(query, {fields: fields});
            } else {
              this.ready();
            }
          }
        }
      ]
    }
  ]
});