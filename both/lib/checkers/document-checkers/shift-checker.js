var ShiftDocument = Match.Where(function (shift) {
  check(shift, {
    startTime: Date,
    endTime: Date,
    shiftDate: Date,
    type: Match.OneOf(String, null),

    //optional properties
    _id: HospoHero.checkers.OptionalMongoId,
    section: HospoHero.checkers.OptionalNullableMongoId,
    createdBy: HospoHero.checkers.OptionalNullableMongoId,
    assignedTo: HospoHero.checkers.OptionalNullableMongoId,
    assignedBy: HospoHero.checkers.OptionalNullableMongoId,
    jobs: Match.Optional([HospoHero.checkers.MongoId]),
    status: Match.Optional(Match.OneOf('draft', 'started', 'finished')),
    published: Match.Optional(Boolean),
    publishedOn: Match.Optional(Number),
    startedAt: Match.Optional(Date),
    finishedAt: Match.Optional(Date),
    order: Match.Optional(Number),
    relations: Match.Optional(HospoHero.checkers.Relations)
  });

  var checkerHelper = new DocumentCheckerHelper(shift, Shifts);

  checkerHelper.checkPropertiesGroup(['startTime', 'endTime'], function () {
    if (shift.startTime.getTime() > shift.endTime.getTime()) {
      throw new Meteor.Error("'Start time' should be less then 'end time'");
    }
  });

  checkerHelper.checkPropertiesGroup(['startedAt', 'finishedAt'], function () {
    if (shift.startedAt > shift.finishedAt) {
      throw new Meteor.Error("Started time should be less then finished");
    }
  });

  //check if worker already assigned
  if (shift.assignedTo) {
    checkerHelper.checkPropertiesGroup(['assignedTo', 'shiftDate'], function () {
      var assignedWorker = Meteor.users.findOne({_id: shift.assignedTo});
      if (!assignedWorker) {
        logger.error("Worker not found");
        throw new Meteor.Error(404, "Worker not found");
      }

      var occupiedTimeRange = TimeRangeQueryBuilder.forInterval(shift.startTime, shift.endTime);
      var existInShift = !!Shifts.findOne({
        _id: {$ne: shift._id},
        $or: [
          {startTime: occupiedTimeRange},
          {endTime: occupiedTimeRange},
          {
            startTime: {$lte: shift.startTime},
            endTime: {$gte: shift.endTime}
          }
        ],
        assignedTo: shift.assignedTo
      });
      if (existInShift) {
        logger.error("User already exist in a shift", {"date": shift.shiftDate});
        throw new Meteor.Error(404, "Worker has already been assigned to a shift");
      }
    });

    if (shift.section) {
      checkerHelper.checkPropertiesGroup(['assignedTo', 'section'], function () {
        if (!Meteor.users.findOne({_id: shift.assignedTo, 'profile.sections': shift.section})) {
          logger.error("User not trained for this section", {"sectionId": shift.section});
          throw new Meteor.Error(404, "User not trained for this section");
        }
      });
    }
  }

  return true;
});

Namespace('HospoHero.checkers', {
  /**
   * Shift document checker
   */
  ShiftDocument: ShiftDocument
});