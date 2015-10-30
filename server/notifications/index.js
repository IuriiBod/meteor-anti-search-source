Meteor.methods({
  'readNotifications': function (id) {
    var userId = Meteor.userId();
    if (!userId) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if (!id) {
      logger.error('Notification id not found');
      throw new Meteor.Error(404, "Notification id not found");
    }
    var notification = Notifications.findOne({'_id': id, 'to': userId});
    if (!notification) {
      logger.error('Notification not found');
      throw new Meteor.Error(404, "Notification not found");
    }
    if ((notification.type == "roster") && (notification.actionType == "claim")) {
      var shift = Shifts.findOne(notification.ref);
      if (shift && (shift.assignedTo == null && shift.claimedBy.length > 0)) {
        logger.error("Shift has not been assigned to any worker yet. Can't mark read");
        throw new Meteor.Error(404, "Shift has not been assigned to any worker yet. Can't mark read");
      }
    }
    Notifications.update({'_id': id, 'to': userId}, {$set: {"read": true}});
    logger.info("Notification read", {"user": userId, "notification": id});
  }
});