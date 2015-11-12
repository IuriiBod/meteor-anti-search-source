Meteor.methods({
    addUnavailability: function (newUnavailability) {
        check(newUnavailability, HospoHero.checkers.UnavailabilityChecker);

        Meteor.users.update({_id: this.userId}, {$push: {unavailables: newUnavailability}})
    },
    removeUnavailability: function (unavailability) {
    },

    addLeaveRequest: function (newLeaveRequest) {
        check(newLeaveRequest, HospoHero.checkers.LeaveRequestChecker);

        newLeaveRequest.userId = this.userId;
        newLeaveRequest.apporoved = false;
        newLeaveRequest.declined = false;
        LeaveRequests.insert(newLeaveRequest);
    },
    removeLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);
    },
    approveLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);
    },
    declineLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);
    }
});