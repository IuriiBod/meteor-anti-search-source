var checkError = function (message) {
  throw new Meteor.Error(500, 'Check error: ' + message);
};

var MongoId = Match.Where(function (id) {
  check(id, String);
  return /[0-9a-zA-Z]{17}/.test(id);
});

var NullableMongoId = Match.OneOf(MongoId, null);


if (Meteor.isClient) {
  //mock object for logger on client side
  var logger = {
    error: function () {
    }
  }
}

var InactivityTimeout = Match.Where(function (timeout) {
  check(timeout, Number);
  return timeout >= 1 && timeout <= 65536;
});

var AreaDocument = Match.Where(function(area) {
  check(area, {
    _id: HospoHero.checkers.OptionalMongoId,
    name: Match.Optional(String),
    locationId: HospoHero.checkers.OptionalMongoId,
    organizationId: HospoHero.checkers.OptionalMongoId,
    createdAt: Match.Optional(Number),
    inactivityTimeout: Match.Optional(InactivityTimeout)
  });

  return true;
});

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
    status: Match.Optional(String),
    published: Match.Optional(Boolean),
    publishedOn: Match.Optional(Number),
    startedAt: Match.Optional(Number),
    finishedAt: Match.Optional(Number),
    order: Match.Optional(Number),
    relations: Match.Optional(HospoHero.checkers.Relations)
  });


  //check if worker already assigned
  if (shift.startTime.getTime() > shift.endTime.getTime()) {
    logger.error("Start and end times invalid");
    throw new Meteor.Error("Start and end times invalid");
  }

  if (shift.assignedTo) {
    var assignedWorker = Meteor.users.findOne({_id: shift.assignedTo});
    if (!assignedWorker) {
      logger.error("Worker not found");
      throw new Meteor.Error(404, "Worker not found");
    }

    var existInShift = !!Shifts.findOne({
      _id: {$ne: shift._id},
      shiftDate: TimeRangeQueryBuilder.forDay(shift.shiftDate),
      assignedTo: shift.assignedTo
    });
    if (existInShift) {
      logger.error("User already exist in a shift", {"date": shift.shiftDate});
      throw new Meteor.Error(404, "Worker has already been assigned to a shift");
    }
  }

  //specific checks for existing doc
  if (!!shift._id) {
    var shiftToUpdate = Shifts.findOne({_id: shift._id});

    if (!shiftToUpdate) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
  }

  return true;
});


Namespace('HospoHero.checkers', {
  /**
   * Mongo ID checker
   */
  MongoId: MongoId,

  OptionalMongoId: Match.Optional(MongoId),

  NullableMongoId: NullableMongoId,

  OptionalNullableMongoId: Match.Optional(NullableMongoId),

  WeekDate: Match.Where(function (weekDate) {
    try {
      check(weekDate, {
        week: Number,
        year: Number
      });
    } catch (err) {
      checkError('Incorrect week date');
    }
    return true;
  }),

  Relations: Match.Where(function (relations) {
    try {
      check(relations, {
        organizationId: HospoHero.checkers.MongoId,
        locationId: HospoHero.checkers.OptionalNullableMongoId,
        areaId: HospoHero.checkers.OptionalNullableMongoId
      });
    } catch (err) {
      checkError('Incorrect relation');
    }
    return true;
  }),

  /**
   * Shift document checker
   */
  ShiftDocument: ShiftDocument,

  AreaDocument: AreaDocument
});
