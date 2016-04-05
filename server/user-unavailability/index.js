var canUserAction = function (areaId, action) {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, action);
};
Meteor.methods({
  addUnavailability: function (newUnavailability) {
    if (!this.userId) {
      throw new Meteor.Error('Permission denied', 'You are not logged in!');
    }
    newUnavailability.userId = this.userId;
    newUnavailability.relations = HospoHero.getRelationsObject();
    check(newUnavailability, HospoHero.checkers.UnavailabilityDocument);
    return Unavailabilities.insert(newUnavailability);
  },

  removeUnavailability: function (id) {
    check(id, HospoHero.checkers.UnavailabilityId);
    if (!this.userId || !Unavailabilities.findOne({ _id:id, userId: this.userId })) {
      throw new Meteor.Error('Permission denied', "You can't  remove this unavailability!");
    }
    return Unavailabilities.remove({_id: id});
  },

  createNewLeaveRequest: function (newLeaveRequest) {
    if (!this.userId) {
      throw new Meteor.Error('Permission denied', 'You are not logged in!');
    }

    newLeaveRequest.userId = this.userId;
    newLeaveRequest.relations = HospoHero.getRelationsObject();
    check(newLeaveRequest, HospoHero.checkers.LeaveRequestDocument);

    LeaveRequests.insert(newLeaveRequest, function () {
      var inserterLeaveRequestId = arguments[1];
      sendNotification(inserterLeaveRequestId);
    });
  },

  removeLeaveRequest: function (leaveRequestId) {
    check(leaveRequestId, HospoHero.checkers.LeaveRequestId);
    if (!this.userId) {
      throw new Meteor.Error('Permission denied', 'You are not logged in!');
    }

    var thisLeaveRequest = LeaveRequests.findOne({ _id:leaveRequestId });

    if (thisLeaveRequest.notifyManagerId === this.userId || this.userId === thisLeaveRequest.userId) {
      LeaveRequests.remove({_id: leaveRequestId});
      Notifications.remove({'meta.leaveRequestId': leaveRequestId});
    } else {
      throw new Meteor.Error('Permission denied', 'You can\'t remove this leave request!');
    }
  },
  changeLeaveRequestStatus: function (leaveRequestId, newStatus) {
    check(leaveRequestId, HospoHero.checkers.LeaveRequestId);
    check(newStatus, HospoHero.checkers.LeaveRequestStatusValue);

    let thisLeaveRequest = LeaveRequests.findOne({ _id:leaveRequestId });

    if (!canUserAction(thisLeaveRequest.relations.areaId, 'approve leave requests')) {
      logger.error("User not permitted to edit LeaveRequests");
      throw new Meteor.Error(403, "User not remove to edit LeaveRequests");
    }

    if (!thisLeaveRequest.status || thisLeaveRequest.status.value !== newStatus) {
      LeaveRequests.update(leaveRequestId, {
        $set: {
          status: {
            value: newStatus,
            setBy: this.userId,
            setOn: new Date()
          }
        }
      });
    }
  },
  changeUnavailabilityStatus: function (unavailabilityId, newStatus) {
    check(unavailabilityId, HospoHero.checkers.UnavailabilityId);
    check(newStatus, HospoHero.checkers.LeaveRequestStatusValue);
    let unavailability = Unavailabilities.findOne({ _id:unavailabilityId });

    if (!canUserAction(unavailability.relations.areaId, 'approve unavailability')) {
      logger.error("User not permitted to edit unavailability");
      throw new Meteor.Error(403, "User not remove to edit unavailability");
    }

    if (!unavailability.managerStatus || unavailability.managerStatus.status !== newStatus) {
      Unavailabilities.update(unavailabilityId, {
        $set: {
          status: {
            value: newStatus,
            setBy: this.userId,
            setOn: new Date()
          }
        }
      });
    }
  }
});

var sendNotification = function (insertedLeaveRequestId) {
  var currentLeaveRequest = LeaveRequests.findOne({_id: insertedLeaveRequestId});
  var notificationTitle = 'Leave request from ' + HospoHero.username(currentLeaveRequest.userId);

  var params = {
    recipientName: HospoHero.username(currentLeaveRequest.notifyManagerId),
    startDate: moment(currentLeaveRequest.startDate).format('ddd, DD MMM'),
    endDate: moment(currentLeaveRequest.endDate).format('ddd, DD MMM'),
    leaveRequestId: insertedLeaveRequestId
  };

  var options = {
    interactive: true,
    helpers: {
      approveLeaveRequestUrl: function () {
        return NotificationSender.actionUrlFor('changeLeaveRequestStatus', 'approved', this);
      },
      declineLeaveRequestUrl: function () {
        return NotificationSender.actionUrlFor('changeLeaveRequestStatus', 'declined', this);
      },
      leaveRequestLink: function () {
        return NotificationSender.urlFor('viewLeaveRequest', {id: this.leaveRequestId}, this);
      }
    },
    meta: {
      leaveRequestId: insertedLeaveRequestId
    }
  };

  new NotificationSender(notificationTitle, 'leave_request', params, options).sendBoth(currentLeaveRequest.notifyManagerId);
};