Meteor.publish('profileUser', function (id) {
  if (this.userId) {
    var options = {
      "services.google": 1,
      roles: 1,
      isActive: 1,
      profile: 1,
      username: 1,
      createdAt: 1,
      currentAreaId: 1,
      relations: 1
    };

    logger.info("User published ", id);
    return Meteor.users.find({"_id": id}, {fields: options});
  } else {
    this.ready();
  }
});

Meteor.publish("usersList", function () {
  if (this.userId) {
    var options = {
      username: 1,
      emails: 1,
      isActive: 1,
      "profile.payrates": 1,
      "profile.resignDate": 1,
      currentAreaId: 1
    };

    var currentAreaId = HospoHero.getCurrentAreaId(this.userId);

    var users = Meteor.users.find({"relations.areaIds": currentAreaId}, {fields: options});
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
Meteor.publish("workers", function () {
  if (this.userId) {
    var query = {
      "isActive": true
    };

    var user = Meteor.users.findOne({_id: this.userId});

    if (user.relations.organizationId) {
      var canBeRostedRoles = Meteor.roles.find({
        permissions: Roles.permissions.Roster.canBeRosted.code,
        $or: [
          {organizationId: user.relations.organizationId},
          {default: true}
        ],
        name: {
          $ne: 'Owner'
        }
      }).fetch();

      if (canBeRostedRoles.length) {
        canBeRostedRoles = _.map(canBeRostedRoles, function (role) {
          return role._id;
        });
      }

      if (user.currentAreaId) {
        query["relations.areaIds"] = user.currentAreaId;
        query["roles." + user.currentAreaId] = {$in: canBeRostedRoles};
      }
      return Meteor.users.find(query);
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});

Meteor.publish("selectedUsers", function (ids) {
  if (this.userId) {
    logger.info("Selected users published", ids);
    return Meteor.users.find({"_id": {$in: ids}});
  } else {
    this.ready();
  }
});