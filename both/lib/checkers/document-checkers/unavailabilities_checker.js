var UnavailabilityObject = Match.Where(function (unavailability) {
  check(unavailability, {
    startDate: Date,
    endDate: Date,
    repeat: Match.OneOf('monthly', 'weekly', 'never'),
    isAllDay: Boolean,

    _id: HospoHero.checkers.OptionalMongoId,
    comment: Match.Optional(String)
  });

  if (unavailability.startDate > unavailability.endDate) {
    return false;
  }

  return true;
});

var LeaveRequestDocument = Match.Where(function (leaveRequest) {
  check(leaveRequest, {
    startDate: Date,
    endDate: Date,
    notifyManagerId: HospoHero.checkers.MongoId,
    userId: HospoHero.checkers.MongoId,
    status: Match.OneOf('awaiting', 'declined', 'approved'),

    _id: HospoHero.checkers.OptionalMongoId,
    comment: Match.Optional(String)
  });

  var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(leaveRequest, LeaveRequests);

  checkerHelper.checkPropertiesGroup(['startDate', 'endDate'], function () {
    if (leaveRequest.startDate.getTime() > leaveRequest.endDate.getTime()) {
      throw new Meteor.Error("'Start time' should be less then 'end time'");
    }
  });

  return true;
});

Namespace('HospoHero.checkers', {
  UnavailabilityObject: UnavailabilityObject,
  LeaveRequestDocument: LeaveRequestDocument
});
