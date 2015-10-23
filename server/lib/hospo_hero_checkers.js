checkError = function (message) {
  throw new Meteor.Error(500, 'Check error: ' + message);
};

Namespace('HospoHero.checkers', {
  /**
   * Mongo ID checker
   */
  MongoId: Match.Where(function (id) {
    var notifyAboutIncorrectId = function () {
      checkError('Incorrect ID');
    };

    try {
      check(id, String);
      //check mongo id using regexp
    } catch (err) {
      notifyAboutIncorrectId()
    }

    if (!/[0-9a-zA-Z]{17}/.test(id)) {
      notifyAboutIncorrectId()
    }
    return true;
  }),

  OptionalMongoId: Match.Where(function (id) {
    var optionalPattern = Match.Optional(Match.OneOf(HospoHero.checkers.MongoId, null));
    check(id, optionalPattern);
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
