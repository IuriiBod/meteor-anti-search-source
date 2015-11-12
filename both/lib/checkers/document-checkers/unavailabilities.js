var UnavailabilityChecker = Match.Where(function (unavailability) {
    check(unavailability, {
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
