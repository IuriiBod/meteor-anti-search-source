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

PushNotificationSender.prototype._isApnsToken = function (deviceToken) {
  //token length: gcm: 152, apns: 64
  return deviceToken.length === 64;
};

PushNotificationSender.prototype._sendApnsNotification = function (deviceToken, notificationData) {
  var connection = new Apns.Connection({
    keyFile: Apns.getAssetAbsolutePath('apns_key.pem'),
    certFile: Apns.getAssetAbsolutePath('apns_cert.pem'),
    passphrase: Meteor.settings.APNS.passphrase,
    debug: true,
    errorCallback: function (errorCode) {
      //find out error by it's code
      var errors = Object.keys(Apns.Errors);
      var currentError = _.find(errors, function (error) {
        return Apns.Errors[error] === errorCode;
      });

      logger.error('Error while sending notification', {error: currentError, token: deviceToken});
    }
  });

  var notification = new Apns.Notification();

  //todo: use notification data
  notification.alert = "Hello World!";

  //todo: token
  notification.device = new Apns.Device(deviceToken);

  connection.sendNotification(notification);

  console.log('Notification sended');
};

PushNotificationSender.prototype._sendGcmNotification = function (deviceToken, notificationData) {
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

  if (this.isDeviceRegistered()) {
    var self = this;
    this._deviceTokens.forEach(function (deviceToken) {
      if (self._isApnsToken(deviceToken)) {
        self._sendApnsNotification(deviceToken, notification);
      } else {
        self._sendGcmNotification(deviceToken, notification);
      }
    });
  }
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
  }
});
