StaleSession = {
  _onGetInactivityTimeoutCb: null,

  onGetInactivityTimeout: function (callback) {
    this._onGetInactivityTimeoutCb = callback;
  },

  get defaultInactivityTimeout() {
    return 600000;
  },

  // inactivityTimeout
  get inactivityTimeout() {
    return this._onGetInactivityTimeoutCb && this._onGetInactivityTimeoutCb() || this.defaultInactivityTimeout;
  },

  // heartbeatInterval
  get heartbeatInterval() {
    return 1000;
  },

  // activityEvents
  get activityEvents() {
    return "mousemove click keydown touchstart touchend";
  },

  // sessionExpired
  get sessionExpired() {
    return Session.get("StaleSession.sessionExpired");
  },
  set sessionExpired(val) {
    Session.setPersistent("StaleSession.sessionExpired", val);
  },

  // lastActivity
  get lastActivity() {
    var val = Session.get("StaleSession.lastActivity");
    return val || new Date();
  },

  set lastActivity(val) {
    if (_.isDate(val)) {
      val = val.getTime();
    }
    Session.setPersistent("StaleSession.lastActivity", val);
  },

  get timeFromLastActivity() {
    return new Date() - this.lastActivity;
  },

  onSessionExpiration: function () {
  },

  onReset: function () {
  },

  reset: function () {
    this.sessionExpired = false;
    this.lastActivity = new Date();
    this.onReset();
  },

  start: function () {
    if (this.sessionExpired && Meteor.userId()) {
      this.onSessionExpiration();
      Meteor.logout(function () {
      }, true);
    } else {
      if (this.timeFromLastActivity >= this.inactivityTimeout) {
        this.sessionExpired = true;
      }
    }
    Meteor.setTimeout(this.start.bind(this), this.heartbeatInterval);
  }
};


var originalMeteorLogout = Meteor.logout.bind(Meteor);
Meteor.logout = function (resultCallback, isPinLogout) {
  if (isPinLogout) {
    Meteor.call('__StaleSession.retainTokenForPinLogin', token, function (err, res) {
      if (err) {
        console.log('Stale Session:', err);
      }
      //logout method should be called in any case (even if token retain failed)
      originalMeteorLogout(resultCallback);
    });
  } else {
    originalMeteorLogout(resultCallback);
  }
};


var originalMeteorLoginWithToken = Meteor.loginWithToken.bind(Meteor);
Meteor.loginWithToken = function (token, resultCallback, userId) {
  if (userId) {
    Meteor.call('__StaleSession.restoreTokenForPinLogin', userId, token, function (err, res) {
      if (!err) {
        originalMeteorLoginWithToken(token, resultCallback);
      } else {
        console.log('Stale Session:', err);
      }
    });
  } else {
    originalMeteorLoginWithToken(token, resultCallback);
  }
};


Meteor.startup(function () {
  StaleSession.lastActivity = new Date();
  $(document).on(StaleSession.activityEvents, function () {
    StaleSession.lastActivity = new Date();
  });
  StaleSession.start();
});