let ApplicationDocument = Match.Where(application => {
  check(application, {
    createdAt: Date,
    details: Object,
    relations: HospoHero.chackers.Relations,

    _id: HospoHero.checkers.OptionalMongoId,
    appProgress: Match.Optional([String])
  });

  return true;
});