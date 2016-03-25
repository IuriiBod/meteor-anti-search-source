let InterviewDocument = Match.Where(interview => {
  check(interview, {
    applicationId: HospoHero.checkers.MongoId,
    startTime: Date,
    endTime: Date,
    createdAt: Date,
    interviewee: String,
    createdBy: HospoHero.checkers.MongoId,

    _id: HospoHero.checkers.OptionalMongoId,
    interviewers: Match.Optional([HospoHero.checkers.MongoId]),
    agendaAndMinutes: Match.Optional(String)
  });

  return true;
});

Namespace('HospoHero.checkers', {
  InterviewDocument: InterviewDocument
});