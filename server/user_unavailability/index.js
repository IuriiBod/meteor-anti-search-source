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

        var isNotifyManagerExist = !!Meteor.users.find({_id: newLeaveRequest.notifyManagerId});
        if (isNotifyManagerExist) {
            newLeaveRequest.userId = this.userId;
            newLeaveRequest.approved = false;
            newLeaveRequest.declined = false;
            LeaveRequests.insert(newLeaveRequest);
        } else {
            throw new Meteor.Error('Error', 'Chosen manager not exist in DB!');
        };
    },
    removeLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);

        var thisLeaveRequest = LeaveRequests.findOne({_id: leaveRequestId});
        if (thisLeaveRequest.notifyManagerId == this.userId || this.userId == thisLeaveRequest.userId) {
            LeaveRequests.remove({_id: leaveRequestId});
        } else {
            throw new Meteor.Error('Permission denied', 'You can\' remove this leave request!');
        };
    },
    approveLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);

        var thisLeaveRequest = LeaveRequests.findOne({_id: leaveRequestId});

        if (HospoHero.canUser('approve leave requests', this.userId) && thisLeaveRequest.userId != this.userId) {
            LeaveRequests.update(leaveRequestId, {$set: {approved: true}});
        } else {
            throw new Meteor.Error('Permission denied', 'You can\' approve this leave request!');
        };
    },
    declineLeaveRequest: function (leaveRequestId) {
        check(leaveRequestId, HospoHero.checkers.MongoId);

        var thisLeaveRequest = LeaveRequests.findOne({_id: leaveRequestId});

        if (HospoHero.canUser('decline leave requests', this.userId) && thisLeaveRequest.userId != this.userId) {
            LeaveRequests.update(leaveRequestId, {$set: {declined: true}});
        } else {
            throw new Meteor.Error('Permission denied', 'You can\' decline this leave request!');
        };
    }
});