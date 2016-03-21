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
    agendaAndMinutes: Match.Optional(String)
  });

  return true;
});

Namespace('HospoHero.checkers', {
  InterviewDocument: InterviewDocument
});

//let i = {
//  applicationId: 'WEqGEyJinEeMyrSxZ',
//  createdAt: new Date(),
//  interviewee: 'Vadym Vorobel',
//  createdBy: 'kfZMbk62tgFSxmDen'
//};
//
//Interviews.insert(i);