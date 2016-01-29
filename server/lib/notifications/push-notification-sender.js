/**
 * Sends mobile notification using GCM
 *
 * @param receiverId user's ID to receive notification
 * @constructor
 */
PushNotificationSender = function (receiverId) {
  this._receiverId = receiverId;
};


PushNotificationSender.prototype._getDeviceTokens = function () {
  var user = Meteor.users.findOne({_id: this._receiverId}, {fields: {pushNotificationTokens: 1}});
  return user && user.pushNotificationTokens || [];
};


PushNotificationSender.prototype._sendGcmNotification = function (notificationData) {
  if (this.isDeviceRegistered()) {
    this._deviceTokens.forEach(function (deviceToken) {
      try {
        var response = HTTP.post('https://gcm-http.googleapis.com/gcm/send', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=' + Meteor.settings.GCM.key
          },
          data: {
            data: notificationData,
            to: deviceToken
          }
        });

        logger.info('Send push notification', {response_data: response.data});
      } catch (err) {
        logger.error('Error while sending push notification', {response: err});
      }
    });
  }
};

PushNotificationSender.prototype.isDeviceRegistered = function () {
  if (!this._deviceTokens) {
    this._deviceTokens = this._getDeviceTokens();
  }
  return this._deviceTokens.length > 0;
};

/**
 *
 * Sends specified notification to receiver
 *
 * @param {Object} notificationData
 * @param {String} notificationData.title notification title
 * @param {String} notificationData.text message
 *
 * @param notificationData
 */
PushNotificationSender.prototype.send = function (notificationData) {
  var notification = {
    title: notificationData.title,
    message: notificationData.text,
    extra: {} // data payload
  };

  this._sendGcmNotification(notification);
};


PushNotificationSender.registerDeviceToken = function (userId, token) {
  Meteor.users.update({_id: userId}, {$addToSet: {pushNotificationTokens: token}});
};


PushNotificationSender.removeDeviceToken = function (userId, token) {
  Meteor.users.update({_id: userId}, {$pull: {pushNotificationTokens: token}});
};


var PushDeviceTokenChecker = Match.Where(function (token) {
  check(token, String);
  return token.length > 10;
});

/* Tokens' public interface */

Meteor.methods({
  registerPushDeviceToken: function (token) {
    check(token, PushDeviceTokenChecker);

    if (this.userId) {
      PushNotificationSender.registerDeviceToken(this.userId, token);
    }
  },

  removePushDeviceToken: function (token) {
    check(token, PushDeviceTokenChecker);

    if (this.userId) {
      PushNotificationSender.removeDeviceToken(this.userId, token);
    }
  },

  testNotification: function (userId, title, text) {
    check(userId, HospoHero.checkers.MongoId);

    if (!HospoHero.isOrganizationOwner(this.userId)) {
      throw new Meteor.Error(403, 'You have no power here!');
    }

    var pushSender = new PushNotificationSender(userId);
    pushSender.send({
      title: title || 'Test title',
      text: text || 'this is test notification'
    });
  }
});
