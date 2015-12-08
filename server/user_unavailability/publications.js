Meteor.publish('userAllUnavailabilities', function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'unavailabilities': 1}});
});

Meteor.publish('userAllLeaveRequests', function () {
    return LeaveRequests.find({userId: this.userId});
});

Meteor.publish('allLeaveRequests', function () {
    return LeaveRequests.find();
});