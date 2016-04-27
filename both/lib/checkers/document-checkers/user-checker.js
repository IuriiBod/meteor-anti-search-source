var UserRelations = Match.Where(function (relation) {
  try {
    check(relation, {
      organizationIds: Match.OneOf([HospoHero.checkers.MongoId], null),
      locationIds: Match.OneOf([HospoHero.checkers.MongoId], null),
      areaIds: Match.OneOf([HospoHero.checkers.MongoId], null)
    });
  } catch (err) {
    HospoHero.checkerUtils.checkError('Incorrect user relations object!');
  }
  return true;
});

var UserChecker = Match.Where(function (user) {
  check(user, {
    _id: HospoHero.checkers.MongoId,
    createdAt: Date,
    services: Object,
    profile: Object,
    emails: Array,
    relations: UserRelations,
    roles: Match.Optional(Object),
    lastLoginDate: Match.Optional(Date)
  });

  return true;
});

var UserPassword =  Match.Where(function (password) {
  check(password, String)
  return HospoHero.regExp.password.test(password);
});

Namespace('HospoHero.checkers', {
  UserChecker: UserChecker,
  UserPassword:UserPassword
});