Meteor.methods({
    addUnavailability: function (newUnavailability) {
        newUnavailability._id = Random.id();
        check(newUnavailability, HospoHero.checkers.UnavailabilityChecker);

        console.log('newUnavailability:\n', newUnavailability);
        Meteor.users.update({_id: this.userId}, {$push: {unavailables: newUnavailability}})
    },
    removeUnavailability: function (unavailability) {
        check(unavailability, HospoHero.checkers.UnavailabilityChecker);

        Meteor.users.update({_id: this.userId}, {$pull: {unavailables: unavailability}});
    },

    createNewLeaveRequest: function (newLeaveRequest) {
        check(newLeaveRequest, HospoHero.checkers.LeaveRequestChecker);

        newLeaveRequest.userId = this.userId;
        newLeaveRequest.approved = false;
        newLeaveRequest.declined = false;
        LeaveRequests.insert(newLeaveRequest);
    },
    removeLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);

        LeaveRequests.remove({_id: leaveRequestId});
    },
    approveLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);

        LeaveRequests.update(leaveRequestId, {$set: {approved: true}});
    },
    declineLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);

        LeaveRequests.update(leaveRequestId, {$set: {declined: true}});
    }
});