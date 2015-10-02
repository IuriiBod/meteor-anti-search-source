Meteor.publish('profileUser', function(id) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
  var options = {
    "services.google": 1,
    roles: 1,
    isActive: 1,
    profile: 1,
    username: 1,
    createdAt: 1,
    defaultArea: 1,
    relations: 1
  };

  logger.info("User published ", id);
  return Meteor.users.find({"_id": id}, {fields: options});
});

Meteor.publish("usersList", function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
  var options = {
    username: 1,
    emails: 1,
    isActive: 1,
    "profile.payrates": 1,
    "profile.resignDate": 1,
    defaultArea: 1
  };

  var users = Meteor.users.find({ "relations.areaId": HospoHero.currentArea(this.userId) }, {fields: options}, {limit: 10});
  logger.info("Userlist published");
  return users;
});

Meteor.publish("selectedUsersList", function(usersIds) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var options = {
    username: 1,
    emails: 1,
    isActive: 1,
    profile: 1,
    defaultArea: 1
  };

  logger.info("SelectedUserlist published");
  return Meteor.users.find({
    _id: { $in: usersIds },
    "relations.areaId": HospoHero.currentArea(this.userId)
  }, {
    fields: options
  });
});

//managers and workers that should be assigned to shifts
Meteor.publish("workers", function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {
    "isActive": true
  };

  var user = Meteor.users.findOne({_id: this.userId});

  var canBeRostedRoles = Meteor.roles.find({
    permissions: Roles.permissions.Roster.canBeRosted.code,
    $or: [
      { organizationId: user.relations.organizationId },
      { default: true }
    ],
    name: {
      $ne: 'Owner'
    }
  }).fetch();

  if(canBeRostedRoles.length) {
    canBeRostedRoles = _.map(canBeRostedRoles, function(role) {
      return role._id;
    });
  }

  if(user.defaultArea) {
    query["relations.areaIds"] = user.defaultArea;
    query["roles." + user.defaultArea] = {$in: canBeRostedRoles};
  }

  return Meteor.users.find(query);
});

Meteor.publish("selectedUsers", function(ids) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  logger.info("Selected users published", ids);
  return Meteor.users.find({"_id": {$in: ids}});
});