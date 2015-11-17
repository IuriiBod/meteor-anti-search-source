Namespace('HospoHero', {
  isDatabaseImportMode: function () {
    return !!process.env.DATABASE_IMPORT_MODE;
  },
  isProductionMode: function () {
    return process.env.ROOT_URL.indexOf('app.hospohero.com') > -1;
  },
  isTestingMode: function () {
    return !HospoHero.isDevelopmentMode() && !HospoHero.isProductionMode();
  },
  isDevelopmentMode: function () {
    return process.env.NODE_ENV === 'development';
    // environment user check:
    // prevents loading mock data while migrating on local machine
    //&& process.env.USER !== 'taras';
  },
  sendNotification: function (notification) {
    if (!notification.title) {
      throw new Meteor.Error('Notification must have a title');
    }

    var notificationOptions = {
      to: [],
      type: '',
      read: false,
      createdBy: null,
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
      var subscriptionsQuery = {
        type: notificationOptions.type,
        'relations.areaId': HospoHero.getCurrentAreaId()
      };

      if (notificationOptions.ref == '') {
        subscriptionsQuery.itemIds = 'all';
      } else {
        subscriptionsQuery.$or = [
          {itemIds: notificationOptions.ref},
          {itemIds: 'all'}
        ];
      }

      var subscriberIds = Subscriptions.find(subscriptionsQuery).map(function (subscription) {
        return subscription.subscriber;
      });

      sendNotificationToId = sendNotificationToId.concat(subscriberIds);
    }

    var userIdIndex = sendNotificationToId.indexOf(notificationOptions.createtedBy);
    if (userIdIndex > -1) {
      sendNotificationToId.splice(userIdIndex, 1);
    }

    if (sendNotificationToId.length) {
      sendNotificationToId.forEach(function (to) {
        notificationOptions.to = to;
        Notifications.insert(notificationOptions);
      });
    }
  }
});