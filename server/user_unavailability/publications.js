Meteor.publish('userAllUnavailabilities', function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'unavailables': 1}});
});


Meteor.publish('userAllLeaveRequests', function () {
    return LeaveRequests.find({userId: this.userId});
});

Meteor.publish('leaveRequest', function (id) {
    return LeaveRequests.find({_id: id, userId: this.userId});
});