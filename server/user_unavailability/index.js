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
    if (!this.userId) {
      throw new Meteor.Error('Permission denied', 'You are not logged in!');
    }

    newLeaveRequest.userId = self.userId;
    newLeaveRequest.status = 'awaiting';
    check(newLeaveRequest, HospoHero.checkers.LeaveRequestDocument);

    LeaveRequests.insert(newLeaveRequest, function () {
      var inserterLeaveRequestId = arguments[1];
      sendNotification(inserterLeaveRequestId);
    });
  },
  removeLeaveRequest: function (leaveRequestId) {
    if (!this.userId) {
      throw new Meteor.Error('Permission denied', 'You are not logged in!');
    }
    //check(leaveRequestId, HospoHero.checkers.MongoId);

    var thisLeaveRequest = findLeaveRequest(leaveRequestId);
    check(thisLeaveRequest, HospoHero.checkers.LeaveRequestDocument);

    if (thisLeaveRequest.notifyManagerId == this.userId || this.userId == thisLeaveRequest.userId) {
      LeaveRequests.remove({_id: leaveRequestId});
      Notifications.remove({'meta.leaveRequestId': leaveRequestId});
    } else {
      throw new Meteor.Error('Permission denied', 'You can\' remove this leave request!');
    }
  },
  changeLeaveRequestStatus: function (leaveRequestId, newStatus) {
    var thisLeaveRequest = findLeaveRequest(leaveRequestId);
    check(thisLeaveRequest, HospoHero.checkers.LeaveRequestDocument);

    if (thisLeaveRequest.status != 'awaiting') {
      throw new Meteor.Error("'This request already approved/declined'");
    }

    if (thisLeaveRequest.notifyManagerId != this.userId) {
      throw new Meteor.Error("'You can't approve or decline this request'");
    }

    LeaveRequests.update(leaveRequestId, {$set: {status: newStatus}});
    Notifications.remove({'meta.leaveRequestId': leaveRequestId});
  }
});

var findLeaveRequest = function (leaveRequestId) {
  var thisLeaveRequest = LeaveRequests.findOne({_id: leaveRequestId});
  if (!thisLeaveRequest) {
    throw  new Meteor.Error('Error', 'Leave request is not exist!');
  }
  return thisLeaveRequest;
};


var sendNotification = function (insertedLeaveRequestId) {

  var currentLeaveRequest = LeaveRequests.findOne({_id: insertedLeaveRequestId});

  var notificationSender = Meteor.users.findOne({_id: currentLeaveRequest.userId});
  var notificationRecipient = Meteor.users.findOne({_id: currentLeaveRequest.notifyManagerId});

  var notificationTitle = 'Leave request from ' + notificationSender.profile.name || notificationSender.username;

  var params = {
    recipientName: notificationRecipient.profile.name || notificationRecipient.username,

    startDate: moment(currentLeaveRequest.startDate).format('ddd, DD MMM'),
    endDate: moment(currentLeaveRequest.endDate).format('ddd, DD MMM'),

    leaveRequestLink: Router.url('viewLeaveRequest', {id: insertedLeaveRequestId})
  };

  var options = {
    interactive: true,
    helpers: {
      approveLeaveRequestUrl: function () {
        return NotificationSender.actionUrlFor('changeLeaveRequestStatus', insertedLeaveRequestId, 'approved');
      },
      declineLeaveRequestUrl: function () {
        return NotificationSender.actionUrlFor('changeLeaveRequestStatus', insertedLeaveRequestId, 'declined');
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