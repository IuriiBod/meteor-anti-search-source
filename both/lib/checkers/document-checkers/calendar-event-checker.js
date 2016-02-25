var CalendarEventDocument = Match.Where(function (calendarEvent) {
  check(calendarEvent, {
    itemId: HospoHero.checkers.MongoId,
    startTime: Date,
    endTime: Date,
    type: String,
    userId: HospoHero.checkers.MongoId,
    locationId: HospoHero.checkers.MongoId,
    shiftId: HospoHero.checkers.OptionalMongoId,

    // Optional
    _id: HospoHero.checkers.OptionalMongoId,
    doneCheckListItems: Match.Optional([Number])
  });

  var shift = Shifts.findOne({_id: calendarEvent.shiftId});

  var isBetween = function (date) {
    date = moment(date);
    return date.isSameOrAfter(shift.startTime) && date.isSameOrBefore(shift.endTime);
  };

  // check event time is between shift start and end time
  if (isBetween(calendarEvent.startTime) && isBetween(calendarEvent.endTime)) {
    return true;
  } else {
    throw new Meteor.Error('Event must be placed in shift time');
  }
});

Namespace('HospoHero.checkers', {
  CalendarEventDocument: CalendarEventDocument
});