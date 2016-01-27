var CalendarEventDocument = Match.Where(function (calendarEvent) {
  check(calendarEvent, {
    itemId: HospoHero.checkers.MongoId,
    startTime: Date,
    endTime: Date,
    date: Date,
    type: String,
    userId: HospoHero.checkers.MongoId,
    locationId: HospoHero.checkers.MongoId,

    // Optional
    _id: HospoHero.checkers.OptionalMongoId,
    doneCheckListItems: Match.Optional([Number])
  });

  return true;
});

Namespace('HospoHero.checkers', {
  CalendarEventDocument: CalendarEventDocument
});