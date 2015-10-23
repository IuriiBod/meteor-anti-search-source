Namespace('HospoHero.checkers', {
  /**
   * Mongo ID checker
   */
  MongoId: Match.Where(function (id) {
    check(id, String);
    //check mongo id using regexp
    return /[0-9a-zA-Z]{17}/.test(id);
  }),
  WeekDate: Match.Where(function (weekDate) {
    check(weekDate, {
      week: Number,
      year: Number
    });
    return true;
  })
});
