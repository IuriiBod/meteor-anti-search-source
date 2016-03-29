let InterviewDocument = Match.Where(interview => {
  check(interview, {
    applicationId: HospoHero.checkers.MongoId,
    startTime: Date,
    endTime: Date,
    interviewee: String,

    _id: HospoHero.checkers.OptionalMongoId,
    interviewers: Match.Optional([HospoHero.checkers.MongoId]),
    agendaAndMinutes: Match.Optional(String),
    createdAt: Match.Optional(Date),
    createdBy: HospoHero.checkers.OptionalMongoId,
    relations: Match.Optional(HospoHero.checkers.Relations)
  });

  return true;
});

Namespace('HospoHero.checkers', {
  InterviewDocument: InterviewDocument
});