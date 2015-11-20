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
        var self = this;
        check(self.userId, HospoHero.checkers.MongoId);

        newLeaveRequest.userId = self.userId;
        newLeaveRequest.status = 'awaiting';
        check(newLeaveRequest, HospoHero.checkers.LeaveRequestDocument);

        LeaveRequests.insert(newLeaveRequest, function () {
            var inserterLeaveRequestId = arguments[1];
            sendNotification(inserterLeaveRequestId, self.connection.httpHeaders.host);
        });
    },
    removeLeaveRequest: function (leaveRequestId) {
        check(this.userId, HospoHero.checkers.MongoId);
        check(leaveRequestId, HospoHero.checkers.MongoId);

        var thisLeaveRequest = findLeaveRequest(leaveRequestId);

        if (thisLeaveRequest.notifyManagerId == this.userId || this.userId == thisLeaveRequest.userId) {
            LeaveRequests.remove({_id: leaveRequestId});
            Notifications.remove({'meta.leaveRequestId': leaveRequestId});
        } else {
            throw new Meteor.Error('Permission denied', 'You can\' remove this leave request!');
        }
    },
    approveLeaveRequest: function (leaveRequestId) {
        check(this.userId, HospoHero.checkers.MongoId);
        check(leaveRequestId, HospoHero.checkers.MongoId);

        changeLeaveRequestStatus(this.userId, leaveRequestId, 'approved');
    },
    declineLeaveRequest: function (leaveRequestId) {
        check(this.userId, HospoHero.checkers.MongoId);
        check(leaveRequestId, HospoHero.checkers.MongoId);

        changeLeaveRequestStatus(this.userId, leaveRequestId, 'declined');
    }
});


var changeLeaveRequestStatus = function (currentUserId, leaveRequestId, newStatus) {
    var thisLeaveRequest = findLeaveRequest(leaveRequestId);
    thisLeaveRequest.currentUserId = currentUserId;

    check(thisLeaveRequest, HospoHero.checkers.canBeApprovedOrDeclined);

    LeaveRequests.update(leaveRequestId, {$set: {status: newStatus}});
    Notifications.remove({'meta.leaveRequestId': leaveRequestId});
};

var findLeaveRequest = function (leaveRequestId) {
    var thisLeaveRequest = LeaveRequests.findOne({_id: leaveRequestId});
    if (!thisLeaveRequest) {
        throw  new Meteor.Error('Error', 'Leave request is not exist!');
    }
    return thisLeaveRequest;
};


var sendNotification = function (insertedLeaveRequestId, hostname) {
    // add prefix, if hostname doesn't have it
    if (!/^http:\/\/.+/.test(hostname)) {
        hostname = 'http://' + hostname;
    }

    var currentLeaveRequest = LeaveRequests.findOne({_id: insertedLeaveRequestId});

    var notificationSender = Meteor.users.findOne({_id: currentLeaveRequest.userId});
    var notificationRecipient = Meteor.users.findOne({_id: currentLeaveRequest.notifyManagerId});

    var notificationTitle = 'Leave request from ' + notificationSender.profile.name || notificationSender.username;

    var params = {
        recipientName: notificationRecipient.profile.name || notificationRecipient.username,

        startDate: moment(currentLeaveRequest.startDate).format('ddd, DD MMM'),
        endDate: moment(currentLeaveRequest.endDate).format('ddd, DD MMM'),

        leaveRequestLink: hostname + '/leaveRequests/' + insertedLeaveRequestId
    };

    var options = {
        interactive: true,
        helpers: {
            approveLeaveRequestUrl: function () {
                return NotificationSender.actionUrlFor('approveLeaveRequest', insertedLeaveRequestId);
            },
            declineLeaveRequestUrl: function () {
                return NotificationSender.actionUrlFor('declineLeaveRequest', insertedLeaveRequestId);
            }
        },
        meta: {
            leaveRequestId: insertedLeaveRequestId
        }
    };

    // // For testing
    //new NotificationSender(notificationTitle, 'leave_request', params, options).sendBoth(notificationSender._id);

    new NotificationSender(notificationTitle, 'leave_request', params, options).sendBoth(notificationRecipient._id);
};