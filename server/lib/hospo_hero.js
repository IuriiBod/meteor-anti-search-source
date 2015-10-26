Namespace('HospoHero', {
  sendNotification: function(notification) {
    if(!notification.to || !notification.title) {
      throw new Meteor.Error('Notification must have title and recipient');
    }

    var notificationOptions = {
      type: '',
      read: false,
      createtedBy: null,
      ref: '',
      text: '',
      createdOn: Date.now(),
      relations: HospoHero.getRelationsObject()
    };

    _.extend(notificationOptions, notification);

    if(!notificationOptions.createdBy) {
      notificationOptions.createdBy = Meteor.userId() || null;
    }

    Notifications.insert(notificationOptions);
  }
});