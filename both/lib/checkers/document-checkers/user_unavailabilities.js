var UnavailabilityChecker = Match.Where(function (unavailability) {
    check(unavailability, {
        _id: HospoHero.checkers.MongoId,
        startDate: Date,
        endDate: Date,
        repeat: checkRepeatField,

        comment: Match.Optional(String)
    });
    return true;
});

var LeaveRequestChecker = Match.Where(function (leaveRequest) {
    check(leaveRequest, {
        startDate: Date,
        endDate: Date,
        notifyManagerId: HospoHero.checkers.MongoId,
        comment: Match.Optional(String)
    });
    return true;
});

var checkRepeatField = Match.Where(function (value) {
    var res = !!_.find(['monthly', 'weekly', 'never'], function(allowedValue) {
        return allowedValue == value;
    });
    return res;
});

Namespace('HospoHero.checkers', {
    UnavailabilityChecker: UnavailabilityChecker,
    LeaveRequestChecker: LeaveRequestChecker
});
