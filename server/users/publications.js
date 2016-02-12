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


Meteor.publish('areaUsersList', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  //todo: any security (permissions) checks here?

  let fieldsToPublish = HospoHero.security.getPublishFieldsFor('users', {
    'profile.payrates': 1,
    'profile.resignDate': 1
  });

  logger.info('UserList published', {areaId: areaId});

  return Meteor.users.find({
    'relations.areaIds': areaId
  }, {
    fields: fieldsToPublish
  });
});


Meteor.publish('selectedUsersList', function (usersIds) {
  check(usersIds, [HospoHero.checkers.MongoId]);

  //no security checks required: this method is relatively safe

  let fieldsToPublish = HospoHero.security.getPublishFieldsFor('users');

  logger.info('SelectedUsersList published', {ids: usersIds});
  return Meteor.users.find({
    _id: {$in: usersIds}
  }, {
    fields: fieldsToPublish
  });
});