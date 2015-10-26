checkError = function (message) {
  throw new Meteor.Error(500, 'Check error: ' + message);
};

Namespace('HospoHero.checkers', {
  /**
   * Mongo ID checker
   */
  MongoId: Match.Where(function (id) {
    check(id, String);
    return /[0-9a-zA-Z]{17}/.test(id);
  }),

  OptionalMongoId: Match.Where(function (id) {
    check(id, Match.Optional(HospoHero.checkers.MongoId));
    return true;
  }),

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
        locationId: HospoHero.checkers.OptionalMongoId,
        areaId: HospoHero.checkers.OptionalMongoId
      });
    } catch (err) {
      checkError('Incorrect relation');
    }
    return true;
  })
});
