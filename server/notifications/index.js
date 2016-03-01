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

    Notifications.remove({_id: notificationId, to: userId});

    //notification is sharable between multiple users
    if (notification.shareId) {
      Notifications.remove({shareId: notification.shareId});
    }

    logger.info("Notification read", {userId, notificationId});
  }
});