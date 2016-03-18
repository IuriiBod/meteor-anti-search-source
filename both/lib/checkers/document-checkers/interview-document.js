let InterviewDocument = Match.Where(interview => {
  check(interview, {
    applicationId: HospoHero.checkers.MongoId,
    createdAt: Date,
    interviewee: String,
    createdBy: HospoHero.checkers.MongoId,

    _id: HospoHero.checkers.OptionalMongoId,
    startTime: Match.Optional(Date),
    endTime: Match.Optional(Date),
    interviewers: Match.Optional([HospoHero.checkers.MongoId]),
    agendaAndMinutes: Match.Optional(String),
    status: String
  });

  return true;
});

Namespace('HospoHero.checkers', {
  InterviewDocument: InterviewDocument
});