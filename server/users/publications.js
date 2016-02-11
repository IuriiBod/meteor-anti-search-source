let fullPublicProfileFields = HospoHero.security.getPublishFieldsFor('users', {
  'profile.payrates': 1,
  'profile.resignDate': 1,
  'profile.phone': 1,
  'profile.sections': 1,
  'profile.shiftsPerWeek': 1,
  emails: 1,
  unavailabilities: 1,
  lastLoginDate: 1
});

// current user
Meteor.publish(null, function () {
  if (!this.userId) {
    this.ready();
    return;
  }

  return Meteor.users.find({_id: this.userId}, {fields: fullPublicProfileFields});
});


Meteor.publish('profileUser', function (userId) {
  check(userId, HospoHero.checkers.MongoId);

  //todo: any security (permissions) checks here?

  return Meteor.users.find({_id: userId}, {fields: fullPublicProfileFields});
});


Meteor.publish('usersList', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  //todo: any security (permissions) checks here?

  let fieldsToPublish = HospoHero.security.getPublishFieldsFor('users', {
    'profile.payrates': 1,
    'profile.resignDate': 1
  });

  logger.info("UserList published");

  return Meteor.users.find({
    'relations.areaIds': areaId
  }, {
    fields: fieldsToPublish
  });
});


Meteor.publish("selectedUsersList", function (usersIds) {
  check(usersIds, [HospoHero.checkers.MongoId]);

  //no security checks required: this method is relatively safe

  let fieldsToPublish = HospoHero.security.getPublishFieldsFor('users');

  logger.info("SelectedUsersList published");
  return Meteor.users.find({
    _id: {$in: usersIds}
  }, {
    fields: fieldsToPublish
  });
});


//managers and workers that should be assigned to shifts
Meteor.publish('workers', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  //todo: any security (permissions) checks here?

  var user = this.userId && Meteor.users.findOne(this.userId);
  if (!(user && user.relations && user.relations.organizationIds)) {
    this.ready();
    return;
  }

  let rostedRoleIds = Meteor.roles.find({
    actions: 'be rosted',
    $or: [
      {
        'relations.organizationId': {
          $in: user.relations.organizationIds
        }
      },
      {'default': true}
    ]
  }).map(role => role._id);

  let fieldsToPublish = HospoHero.security.getPublishFieldsFor('users');

  return Meteor.users.find({
    'relations.areaIds': areaId,
    [`roles.${areaId}`]: {$in: rostedRoleIds}
  }, {fields: fieldsToPublish});
});