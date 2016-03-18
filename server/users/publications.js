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


let publishAreaUsersFn = function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  //todo: any security (permissions) checks here?

  let fieldsToPublish = HospoHero.security.getPublishFieldsFor('users', {
    'profile.payrates': 1,
    'profile.resignDate': 1,
    'profile.sections': 1,
    unavailabilities: 1
  });

  logger.info('UserList published', {areaId: areaId});

  return Meteor.users.find({
    'relations.areaIds': areaId
  }, {
    fields: fieldsToPublish
  });
};

// we made 2 subscriptions with same function in order to be able
// subscribe on 2 different documents sets simultaneously
Meteor.publish('areaDetailsUsers', publishAreaUsersFn); // used primarily on area's settings flyout
Meteor.publish('areaUsersList', publishAreaUsersFn); // used anywhere else

Meteor.publish('areaUnavailabilitiesList', function (areaId,limit) {
  check(areaId, HospoHero.checkers.MongoId);
  check(limit, Number);

  const permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);
  if (permissionChecker && permissionChecker.hasPermissionInArea(areaId, 'approve leave requests')) {

    let fieldsToPublish = HospoHero.security.getPublishFieldsFor('users', {
       unavailabilities: 1
    });

    let query = {
       'relations.areaIds': areaId,
       'unavailabilities.0': {'$exists':true}
    };
    let filter = {
      limit:limit,
      fields: fieldsToPublish
    };
    return Meteor.users.find(query,filter);
  } else {
    logger.error('Permission denied: publish [areaUnavailabilitiesList] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
});


Meteor.publish('selectedUsersList', function (usersIds) {
  check(usersIds, [HospoHero.checkers.MongoId]);

  //no security checks required: this method is relatively safe

  let fieldsToPublish = HospoHero.security.getPublishFieldsFor('users');

  _.extend(fieldsToPublish, {
    emails: 1
  });

  logger.info('SelectedUsersList published', {ids: usersIds});
  return Meteor.users.find({
    _id: {$in: usersIds}
  }, {
    fields: fieldsToPublish
  });
});