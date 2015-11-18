Meteor.methods({
    addUnavailability: function (newUnavailability) {
        newUnavailability._id = Random.id();
        check(newUnavailability, HospoHero.checkers.UnavailabilityChecker);

        Meteor.users.update({_id: this.userId}, {$push: {unavailabilities: newUnavailability}})
    },
    removeUnavailability: function (unavailability) {
        check(unavailability, HospoHero.checkers.UnavailabilityChecker);

        Meteor.users.update({_id: this.userId}, {$pull: {unavailabilities: unavailability}});
    },

    createNewLeaveRequest: function (newLeaveRequest) {
        check(newLeaveRequest, HospoHero.checkers.LeaveRequestChecker);

        newLeaveRequest.userId = this.userId;
        newLeaveRequest.status = 'awaiting';
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
        changeLeaveRequestStatus(this.userId, leaveRequestId, 'approved');
    },
    declineLeaveRequest: function (leaveRequestId) {
        changeLeaveRequestStatus(this.userId, leaveRequestId, 'declined');
    }
});


var changeLeaveRequestStatus = function (currentUserId, leaveRequestId, newStatus) {
    check(currentUserId, HospoHero.checkers.CanUserChangeLeaveRequestsStatusChecker);

    var thisLeaveRequest = findLeaveRequest(leaveRequestId);

    console.log(currentUserId, thisLeaveRequest.notifyManagerId, currentUserId == thisLeaveRequest.notifyManagerId);

    if (currentUserId == thisLeaveRequest.userId) {
        throw new Meteor.Error('Error', 'You can\'t change the status of the own leave request!');
    }

    if (thisLeaveRequest.status == 'awaiting') {
        LeaveRequests.update(leaveRequestId, {$set: {status: newStatus}});
    } else {
        throw  new Meteor.Error('Error', 'Leave request is already ' + thisLeaveRequest.status + '!');
    }
};

var findLeaveRequest = function (leaveRequestId) {
    var thisLeaveRequest = LeaveRequests.findOne({_id: leaveRequestId});
    if (!thisLeaveRequest) {
        throw  new Meteor.Error('Error', 'Leave request is not exist!');
    }
    return thisLeaveRequest;
};