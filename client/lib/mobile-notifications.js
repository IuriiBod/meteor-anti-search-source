if (Meteor.isCordova) {
  var PUSH_TOKEN_PROPERTY = 'push_device_token';

  var registerNotificationToken = function () {
    var token = Session.get(PUSH_TOKEN_PROPERTY);
    if (token) {
      Meteor.call('registerPushDeviceToken', token);
    } else {
      console.error('Unable to get push notification device token!');
    }
  };

  var onDeviceReady = function () {
    var senderId = Meteor.settings.public.GCM.senderId;

    //initialize GCM push plugin
    var pushNotification = PushNotification.init({
      android: {
        senderID: senderId,
        icon: 'icon',
        iconColor: '#1AB394'
      },
      ios: {
        senderID: senderId,
        alert: true,
        badge: true,
        sound: true
      },
      windows: {}
    });

    PushNotification.hasPermission(function (permissionResult) {
      if (permissionResult.isEnabled) {
        pushNotification.on('registration', function (registrationResult) {
          //todo: remove it
          console.log('registered', registrationResult);
          var registrationId = registrationResult.registrationId;
          if (registrationId) {
            Session.setPersistent(PUSH_TOKEN_PROPERTY, registrationId);
            Meteor.startup(function () {
              if (Meteor.userId()) {
                registerNotificationToken();
              }
            });
          }
        });

        pushNotification.on('notification', function (notification) {
          console.log('received new notification', notification);
        });

        pushNotification.on('error', function (error) {
          console.log('push notification error', error);
        });
      }
    });
  };

  document.addEventListener('deviceready', onDeviceReady, false);

  //add device token on login
  Accounts.onLogin(registerNotificationToken);

  //remove device token before logout
  var originalAccountsLogout = Accounts.logout;
  Accounts.logout = function () {
    var token = Session.get(PUSH_TOKEN_PROPERTY);
    if (token) {
      Meteor.call('removePushDeviceToken', token);
    }

    originalAccountsLogout.apply(Accounts, arguments);
  };
}
