var ProjectChecker = Match.Where(function (project) {
  check(project, {
    title: String,
    startTime: Date,
    endTime: Date,
    lead: [HospoHero.checkers.MongoId],
    team: [HospoHero.checkers.MongoId],
    status: String,

    _id: HospoHero.checkers.OptionalMongoId,
    agendaAndMinutes: Match.Optional(String),
    createdBy: HospoHero.checkers.OptionalMongoId,
    createdAt: Match.Optional(Date)
  });

  return true;
});

Namespace('HospoHero.checkers', {
  ProjectChecker: ProjectChecker
});