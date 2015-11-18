var UnavailabilityChecker = Match.Where(function (unavailability) {
    check(unavailability, {
        _id: HospoHero.checkers.MongoId,
        startDate: Date,
        endDate: Date,
        repeat: Match.OneOf('monthly', 'weekly', 'never'),

        comment: Match.Optional(String)
    });

    if (unavailability.startDate > unavailability.endDate) {
        return false;
    }

    return true;
});

var LeaveRequestChecker = Match.Where(function (leaveRequest) {
    check(leaveRequest, {
        startDate: Date,
        endDate: Date,
        notifyManagerId: CanUserChangeLeaveRequestsStatusChecker,
        comment: Match.Optional(String)
    });

    if (leaveRequest.startDate > leaveRequest.endDate) {
        return false;
    }

    return true;
});

var CanUserChangeLeaveRequestsStatusChecker = Match.Where(function (userId) {
    check(userId, HospoHero.checkers.MongoId);

    var user = Meteor.users.findOne({_id: userId});

    if (user && HospoHero.canUser('approve leave requests', user._id)
        && HospoHero.canUser('decline leave requests', user._id)) {
        return true;
    }
    return false;
});


Namespace('HospoHero.checkers', {
    UnavailabilityChecker: UnavailabilityChecker,
    LeaveRequestChecker: LeaveRequestChecker,
    CanUserChangeLeaveRequestsStatusChecker: CanUserChangeLeaveRequestsStatusChecker
});
