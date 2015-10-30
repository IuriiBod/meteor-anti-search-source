// Publishing current user
Meteor.publish(null, function () {
  if (this.userId) {
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
  } else {
    this.ready();
  }
});

Meteor.publish('profileUser', function (userId) {
  if (userId) {
    var user = Meteor.users.findOne(userId);

    if (user) {
      var fields = {
        "services.google": 1,
        profile: 1,
        username: 1,
        emails: 1,
        isActive: 1,
        relations: 1,
        createdAt: 1,
        currentAreaId: 1,
        "roles.defaultRole": 1
      };

      if (user.currentAreaId) {
        fields["roles." + user.currentAreaId] = 1;
      }

      return Meteor.users.find({
        _id: userId
      }, {
        fields: fields
      });
    }
  } else {
    this.ready();
  }
});

Meteor.publish('usersList', function (areaId) {
  if (this.userId) {
    var options = {
      username: 1,
      emails: 1,
      isActive: 1,
      "profile.payrates": 1,
      "profile.resignDate": 1,
      currentAreaId: 1
    };

    options["roles." + areaId] = 1;
    var users = Meteor.users.find({'relations.areaIds': areaId}, {fields: options});
    logger.info("Userlist published");
    return users;
  } else {
    this.ready();
  }
});

Meteor.publish("selectedUsersList", function (usersIds) {
  if (this.userId) {
    var options = {
      username: 1,
      emails: 1,
      isActive: 1,
      profile: 1,
      currentAreaId: 1
    };

    logger.info("SelectedUserlist published");
    return Meteor.users.find({
      _id: {$in: usersIds},
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    }, {
      fields: options
    });
  } else {
    this.ready();
  }
});

//managers and workers that should be assigned to shifts
Meteor.publishComposite('workers', function () {
  var currentAreaId;
  return {
    find: function () {
      if (this.userId) {
        var user = Meteor.users.findOne(this.userId);

        currentAreaId = user.currentAreaId ? user.currentAreaId : null;

        if (user && user.relations && user.relations.organizationId) {
          return Meteor.roles.find({
            actions: 'be rosted',
            $or: [
              {'relations.organizationId': user.relations.organizationId},
              {default: true}
            ]
          });
        } else {
          this.ready();
        }
      }
    },
    children: [
      {
        find: function (role) {
          if (currentAreaId) {
            var query = {"relations.areaIds": currentAreaId};
            query["roles." + currentAreaId] = role._id;
            return Meteor.users.find(query);
          } else {
            this.ready();
          }
        }
      }
    ]
  };
});

Meteor.publish("selectedUsers", function (ids) {
  if (this.userId) {
    logger.info("Selected users published", ids);
    return Meteor.users.find({"_id": {$in: ids}});
  } else {
    this.ready();
  }
});