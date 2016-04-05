var LeaveRequestStatusValue = Match.OneOf('approved', 'rejected');

var LeaveRequesStatus = Match.Where(function (obj) {
  check(obj, {
    value: HospoHero.checkers.LeaveRequestStatusValue,
    setBy: HospoHero.checkers.MongoId,
    setOn: Date
  });
  return true;
});

var UnavailabilityId = Match.Where(function (id) {
  check(id, HospoHero.checkers.MongoId);

  if (!Unavailabilities.findOne({_id: id})) {
    throw new Meteor.Error(500, "Unavailability doesn't exists");
  }

  return true;
});

var LeaveRequestId = Match.Where(function (id) {
  check(id, HospoHero.checkers.MongoId);

  if (!LeaveRequests.findOne({_id: id})) {
    throw new Meteor.Error(500, "LeaveRequest doesn't exists");
  }

  return true;
});

var UnavailabilityDocument = Match.Where(function (unavailability) {
  check(unavailability, {
    startDate: Date,
    endDate: Date,
    userId: HospoHero.checkers.MongoId,
    repeat: Match.OneOf('monthly', 'weekly', 'never'),
    isAllDay: Boolean,
    relations: HospoHero.checkers.Relations,
    _id: Match.Optional(HospoHero.checkers.UnavailabilityId),
    comment: Match.Optional(String),
    status:Match.Optional(LeaveRequesStatus)
  });

  return unavailability.startDate <= unavailability.endDate;
});

var LeaveRequestDocument = Match.Where(function (leaveRequest) {
  check(leaveRequest, {
    startDate: Date,
    endDate: Date,
    notifyManagerId: HospoHero.checkers.MongoId,
    userId: HospoHero.checkers.MongoId,
    relations: HospoHero.checkers.Relations,
    _id: Match.Optional(HospoHero.checkers.LeaveRequestId),
    comment: Match.Optional(String),
    status:Match.Optional(LeaveRequesStatus)
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
  UnavailabilityId:UnavailabilityId,
  LeaveRequestId:LeaveRequestId,
  UnavailabilityDocument: UnavailabilityDocument,
  LeaveRequestDocument: LeaveRequestDocument,
  LeaveRequestStatusValue:LeaveRequestStatusValue
});
