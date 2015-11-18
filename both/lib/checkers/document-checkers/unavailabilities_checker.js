var UnavailabilityObject = Match.Where(function (unavailability) {
    check(unavailability, {
        startDate: Date,
        endDate: Date,
        repeat: Match.OneOf('monthly', 'weekly', 'never'),

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

    checkerHelper.checkPropertiesGroup(['notifyManagerId', 'userId'], function () {
        var canUserApproveOrDecline = checkWhetherUserCanChangeLeaveRequest(leaveRequest.notifyManagerId);
        if (!canUserApproveOrDecline) {
            throw new Meteor.Error("'Selected user can't approve or decline this request'");
        }
    });

    return true;
});

var checkWhetherUserCanChangeLeaveRequest = function (userId) {
    var canUserApproveOrDecline = HospoHero.canUser('approve leave requests', userId)
        && HospoHero.canUser('decline leave requests', userId)

    return canUserApproveOrDecline;
};

var canBeApprovedOrDeclined = Match.Where(function (leaveRequest) {
    check(leaveRequest, {
        startDate: Date,
        endDate: Date,
        notifyManagerId: HospoHero.checkers.MongoId,
        userId: HospoHero.checkers.MongoId,
        status: Match.OneOf('awaiting', 'declined', 'approved'),
        _id: HospoHero.checkers.MongoId,
        currentUserId: HospoHero.checkers.MongoId,

        comment: Match.Optional(String)
    });


    if (leaveRequest.status != 'awaiting') {
        throw new Meteor.Error("'This request already approved/declined'");
    }

    if (leaveRequest.notifyManagerId != leaveRequest.currentUserId) {
        throw new Meteor.Error("'You can't approve or decline this request'");
    }

    return true;
});

Namespace('HospoHero.checkers', {
    UnavailabilityObject: UnavailabilityObject,
    LeaveRequestDocument: LeaveRequestDocument,
    canBeApprovedOrDeclined: canBeApprovedOrDeclined
});
