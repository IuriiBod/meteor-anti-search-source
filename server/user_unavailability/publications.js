Meteor.publish('userUnavailables', function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'unavailables': 1}});
});

Meteor.publish('leaveRequests', function () {
    return LeaveRequests.find({userId: this.userId});
});