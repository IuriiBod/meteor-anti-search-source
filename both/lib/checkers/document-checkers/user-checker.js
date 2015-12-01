var UserRelations = Match.Where(function (relation) {
  try {
    check(relation, {
      organizationId: HospoHero.checkers.MongoId,
      locationIds: Match.OneOf([HospoHero.checkers.MongoId], null),
      areaIds: Match.OneOf([HospoHero.checkers.MongoId], null)
    });
  } catch (err) {
    HospoHero.checkerUtils.checkError('Incorrect user relations object!')
  }
  return true;
});

var UserChecker = Match.Where(function (user) {
  check(user, {
    _id: HospoHero.checkers.MongoId,
    createdAt: Date,
    services: Object,
    profile: Object,
    isActive: Boolean,
    emails: Array,
    username: String,
    relations: UserRelations,

    roles: Match.Optional(Object)
  });

  var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(user, Meteor.users);

  checkerHelper.checkProperty('username', function () {
    if (!!Meteor.users.findOne({username: user.username})) {
      logger.error('The user with the same username already exists!');
      throw new Meteor.Error('The user with the same username already exists!');
    }
  });

  return true;
});

Namespace('HospoHero.checkers', {
  UserChecker: UserChecker
});