var MeetingChecker = Match.Where(function (meeting) {
  check(meeting, {
    title: String,
    startTime: Date,
    endTime: Date,
    location: String,
    attendees: [HospoHero.checkers.MongoId],

    _id: HospoHero.checkers.OptionalMongoId,
    accepted: Match.Optional([HospoHero.checkers.MongoId]),
    maybeAccepted: Match.Optional([HospoHero.checkers.MongoId]),
    rejected: Match.Optional([HospoHero.checkers.MongoId]),
    createdBy: HospoHero.checkers.OptionalMongoId,
    createdAt: Match.Optional(Date)
  });

  return true;
});

Namespace('HospoHero.checkers', {
  MeetingChecker: MeetingChecker
});