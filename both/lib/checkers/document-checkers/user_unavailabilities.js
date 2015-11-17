var UnavailabilityChecker = Match.Where(function (unavailability) {
    check(unavailability, {
        _id: HospoHero.checkers.MongoId,
        startDate: Date,
        endDate: Date,
        repeat: checkRepeatField,

        comment: Match.Optional(String)
    });

    if (startDate > endDate) {
        return false;
    };

    return true;
});

var LeaveRequestChecker = Match.Where(function (leaveRequest) {
    check(leaveRequest, {
        startDate: Date,
        endDate: Date,
        notifyManagerId: HospoHero.checkers.MongoId,
        comment: Match.Optional(String)
    });

    if (leaveRequest.startDate > leaveRequest.endDate) {
        return false;
    };

    var notifyManager = Meteor.users.findOne({_id: leaveRequest.notifyManagerId});
    if (!(notifyManager && HospoHero.canUser('approve leave requests'), notifyManager._id)) {
        return false;
    };
    return true;
});

var checkRepeatField = Match.Where(function (value) {
    return !!_.find(['monthly', 'weekly', 'never'], function(allowedValue) {
        return allowedValue == value;
    });
});

Namespace('HospoHero.checkers', {
    UnavailabilityChecker: UnavailabilityChecker,
    LeaveRequestChecker: LeaveRequestChecker
});
