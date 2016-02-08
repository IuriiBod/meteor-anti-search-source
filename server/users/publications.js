// Publishing current user
Meteor.publish(null, function () {
  if (this.userId) {
    var fields = {
      "services.google": 1,
      profile: 1,
      emails: 1,
      isActive: 1,
      relations: 1,
      createdAt: 1,
      currentAreaId: 1,
      roles: 1,
      unavailabilities: 1
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
        emails: 1,
        isActive: 1,
        relations: 1,
        createdAt: 1,
        currentAreaId: 1,
        unavailabilities: 1,
        roles: 1,
        lastLoginDate: 1
      };

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
      emails: 1,
      isActive: 1,
      'profile.firstname': 1,
      'profile.lastname': 1,
      'profile.payrates': 1,
      'profile.resignDate': 1,
      currentAreaId: 1,
      roles: 1
    };

    var query = {};
    if (areaId) {
      query['relations.areaIds'] = areaId;
    }

    var users = Meteor.users.find(query, {fields: options});
    logger.info("Userlist published");
    return users;
  } else {
    this.ready();
  }
});

Meteor.publish("selectedUsersList", function (usersIds) {
  var options = {
    emails: 1,
    isActive: 1,
    profile: 1,
    currentAreaId: 1
  };

  logger.info("SelectedUserlist published");
  return Meteor.users.find({
    _id: {$in: usersIds}
  }, {
    fields: options
  });
});

//managers and workers that should be assigned to shifts
Meteor.publishComposite('workers', function (areaId) {
  return {
    find: function () {
      if (this.userId) {
        var user = Meteor.users.findOne(this.userId);

        if (user && user.relations && user.relations.organizationIds) {
          return Meteor.roles.find({
            actions: 'be rosted',
            $or: [
              {'relations.organizationId': {$in: user.relations.organizationIds}},
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
          if (areaId) {
            var query = {'relations.areaIds': areaId};
            query["roles." + areaId] = role._id;
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