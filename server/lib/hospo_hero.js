Namespace('HospoHero', {
  sendNotification: function(notification) {
    if (!notification.title) {
      throw new Meteor.Error('Notification must have a title');
    }

    var notificationOptions = {
      to: [],
      type: '',
      read: false,
      createtedBy: null,
      ref: '',
      text: '',
      createdOn: Date.now()
    };

    _.extend(notificationOptions, notification);

    if (!notificationOptions.createdBy) {
      notificationOptions.createdBy = Meteor.userId() || null;
    }

    var sendNotificationToId = [];
    sendNotificationToId = sendNotificationToId.concat(notificationOptions.to);

    if (notificationOptions.type == 'menu' || notificationOptions.type == 'job') {
      var type = notificationOptions.type + 'list';
      var subscription = Subscriptions.findOne({_id: type});
      sendNotificationToId = sendNotificationToId.concat(subscription.subscribers);
    }

    var userIdIndex = sendNotificationToId.indexOf(notificationOptions.createtedBy);
    if(userIdIndex > -1) {
      sendNotificationToId.splice(userIdIndex, 1);
    }

    if (sendNotificationToId.length) {
      sendNotificationToId.forEach(function(to) {
        notificationOptions.to = to;
        Notifications.insert(notificationOptions);
      });
    }
  }
});