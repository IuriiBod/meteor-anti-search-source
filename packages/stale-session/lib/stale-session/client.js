MeteorSettings.setDefaults({
  public: {
    persistent_session: {
      default_method: 'temporary'
    }
  }
});

StaleSession = {
  _onGetInactivityTimeoutCb: null,

  _getTokenById: function (userId) {
    var users = Session.get('StaleSession.loggedUsers');
    return users && users[userId];
  },

  _setTokenById: function (userId, token) {
    var users = Session.get('StaleSession.loggedUsers') || {};
    users[userId] = token;
    Session.setPersistent('StaleSession.loggedUsers', users);
  },

  _removeTokenById: function (userId) {
    var users = Session.get('StaleSession.loggedUsers') || {};
    delete users[userId];
    Session.setPersistent('StaleSession.loggedUsers', users);
  },

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
      this._lockWithPin();
    } else {
      if (this.timeFromLastActivity >= this.inactivityTimeout) {
        this.sessionExpired = true;
      }
    }
    Meteor.setTimeout(this.start.bind(this), this.heartbeatInterval);
  },

  mockExpiredSession: function () {
    this.onSessionExpiration();
    this._lockWithPin();
    this.sessionExpired = true;
  },

  _lockWithPin: function () {
    var self = this;
    Meteor.call('__StaleSession.retainTokenForPinLogin', function (err, token) {
      if (err) {
        console.log('Stale Session:', err);
      } else {
        self._setTokenById(Meteor.userId(), token);
      }
      //logout method should be called in any case (even if token retain failed)
      Meteor.logout();
    });
  },

  loginWithPin: function (userId, pinCode, onLoginCallback) {
    var token = this._getTokenById(userId);
    Meteor.call('__StaleSession.loginWithPin', userId, pinCode, function (err, res) {
      if (err) {
        onLoginCallback(err, res);
      } else {
        Meteor.loginWithToken(token, onLoginCallback);
      }
    });
  },

  getStoredUsersIds: function () {
    var users = Session.get('StaleSession.loggedUsers') || {};
    return _.keys(users);
  }
};

Meteor.startup(function () {
  StaleSession.lastActivity = new Date();
  $(document).on(StaleSession.activityEvents, function () {
    StaleSession.lastActivity = new Date();
  });
  StaleSession.start();
});