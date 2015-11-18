Meteor.methods({
    addUnavailability: function (newUnavailability) {
        check(newUnavailability, HospoHero.checkers.UnavailabilityObject);

        Meteor.users.update({_id: this.userId}, {$push: {unavailabilities: newUnavailability}})
    },
    removeUnavailability: function (unavailability) {
        check(unavailability, HospoHero.checkers.UnavailabilityObject);

        Meteor.users.update({_id: this.userId}, {$pull: {unavailabilities: unavailability}});
    },

    createNewLeaveRequest: function (newLeaveRequest) {
        newLeaveRequest.userId = this.userId;
        newLeaveRequest.status = 'awaiting';
        check(newLeaveRequest, HospoHero.checkers.LeaveRequestDocument);

        LeaveRequests.insert(newLeaveRequest);
    },
    removeLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);

        var thisLeaveRequest = findLeaveRequest(leaveRequestId);

        if (thisLeaveRequest.notifyManagerId == this.userId || this.userId == thisLeaveRequest.userId) {
            LeaveRequests.remove({_id: leaveRequestId});
        } else {
            throw new Meteor.Error('Permission denied', 'You can\' remove this leave request!');
        }
    },
    approveLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);

        changeLeaveRequestStatus(this.userId, leaveRequestId, 'approved');
    },
    declineLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);

        changeLeaveRequestStatus(this.userId, leaveRequestId, 'declined');
    }
});


var changeLeaveRequestStatus = function (currentUserId, leaveRequestId, newStatus) {
    var thisLeaveRequest = findLeaveRequest(leaveRequestId);
    thisLeaveRequest.currentUserId = currentUserId;

    check(thisLeaveRequest, HospoHero.checkers.canBeApprovedOrDeclined);

    LeaveRequests.update(leaveRequestId, {$set: {status: newStatus}});
};

var findLeaveRequest = function (leaveRequestId) {
    var thisLeaveRequest = LeaveRequests.findOne({_id: leaveRequestId});
    if (!thisLeaveRequest) {
        throw  new Meteor.Error('Error', 'Leave request is not exist!');
    }
    return thisLeaveRequest;
};