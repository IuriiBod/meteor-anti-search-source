var checkError = function (message) {
  throw new Meteor.Error(500, 'Check error: ' + message);
};

var MongoId = Match.Where(function (id) {
  check(id, String);
  return /[0-9a-zA-Z]{17}/.test(id);
});

var NullableMongoId = Match.OneOf(MongoId, null);


Namespace('HospoHero.checkers', {
  /**
   * Mongo ID checker
   */
  MongoId: MongoId,

  OptionalMongoId: Match.Optional(MongoId),

  NullableMongoId: NullableMongoId,

  OptionalNullableMongoId: Match.Optional(NullableMongoId),

  WeekDate: Match.Where(function (weekDate) {
    try {
      check(weekDate, {
        week: Number,
        year: Number
      });
    } catch (err) {
      checkError('Incorrect week date');
    }
    return true;
  }),

  Relations: Match.Where(function (relations) {
    try {
      check(relations, {
        organizationId: HospoHero.checkers.MongoId,
        locationId: HospoHero.checkers.OptionalNullableMongoId,
        areaId: HospoHero.checkers.OptionalNullableMongoId
      });
    } catch (err) {
      checkError('Incorrect relation');
    }
    return true;
  })
});
