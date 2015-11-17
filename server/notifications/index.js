Meteor.methods({
  readNotifications: function (notificationId) {
    check(notificationId, HospoHero.checkers.MongoId);

    var userId = Meteor.userId();
    if (!userId) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }

    var notification = Notifications.findOne({'_id': notificationId, 'to': userId});

    if (!notification) {
      logger.error('Notification not found');
      throw new Meteor.Error(404, "Notification not found");
    }

    //check for reading interactive notification
    if (notification.interactive) {
      throw new Meteor.Error(404, 'Notification requires your action. Can\'t mark read');
    }


    //todo: get rid of this stuff in future
    if ((notification.type === "roster") && (notification.actionType === "claim")) {
      var shift = Shifts.findOne(notification.ref);
      if (shift && (!shift.assignedTo && shift.claimedBy.length > 0)) {
        logger.error("Shift has not been assigned to any worker yet. Can't mark read");
        throw new Meteor.Error(404, "Shift has not been assigned to any worker yet. Can't mark read");
      }
    }
    Notifications.remove({'_id': notificationId, 'to': userId});
    logger.info("Notification read", {"user": userId, "notification": notificationId});
  },

  changeArea: function (id) {
    var userId = Meteor.userId();
    if (!userId) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if (!Meteor.users.findOne({_id: userId, "relations.areaIds": {$all: [id]}})) {
      logger.error('User ' + userId + ' not assigned to area ' + id);
      throw new Meteor.Error("You are not assigned to that area");
    }
    Meteor.users.update({_id: userId}, {$set: {currentAreaId: id}});
  }
});