MeteorSettings.setDefaults({
  public: {
    persistent_session: {
      default_method: 'temporary'
    }
  }
});

/**
 * Simplifies interface between application and PIN lock
 * functionality
 *
 * @constructor
 */
var PinLockManager = function () {
  this.LOGGED_USERS_KEY = 'StaleSession.loggedUsers';
};


PinLockManager.prototype._getTokenById = function (userId) {
  var users = Session.get(this.LOGGED_USERS_KEY);
  return users && users[userId];
};


PinLockManager.prototype._setTokenById = function (userId, token) {
  var users = Session.get(this.LOGGED_USERS_KEY) || {};
  users[userId] = token;
  Session.setPersistent(this.LOGGED_USERS_KEY, users);
};


PinLockManager.prototype._removeTokenById = function (userId) {
  var users = Session.get(this.LOGGED_USERS_KEY) || {};
  delete users[userId];
  Session.setPersistent(this.LOGGED_USERS_KEY, users);
};


PinLockManager.prototype._printError = function (error) {
  console.log('StaleSession: ', error);
};


PinLockManager.prototype.lockWithPin = function () {
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
};


PinLockManager.prototype.loginWithPin = function (userId, pinCode, onLoginCallback) {
  var token = this._getTokenById(userId);
  this._removeTokenById(userId);
  Meteor.call('__StaleSession.loginWithPin', userId, pinCode, function (err, res) {
    if (err) {
      onLoginCallback(err, res);
    } else {
      Meteor.loginWithToken(token, onLoginCallback);
    }
  });
};


PinLockManager.prototype.getStoredUsersIds = function () {
  var users = Session.get(this.LOGGED_USERS_KEY) || {};
  return _.keys(users);
};


PinLockManager.prototype.checkPinTokens = function (onTokensChecked) {
  var self = this;

  var loginTokens = Session.get(this.LOGGED_USERS_KEY);
  var loginTokensArray = _.map(loginTokens, function (token, userId) {
    return {
      userId: userId,
      token: token
    };
  });

  Meteor.call('__StaleSession.checkLoginTokens', loginTokensArray, function (err, validTokens) {
    if (err) {
      self._printError(err);
    } else {
      //restore valid tokens
      var loggedUsers = _.reduce(validTokens, function (tokens, tokenEntry) {
        tokens[tokenEntry.userId] = tokenEntry.token;
        return tokens;
      }, {});

      Session.setPersistent(self.LOGGED_USERS_KEY, loggedUsers);
    }

    onTokensChecked();
  });
};

/**
 * Provides automatic lock with PIN after specified
 * inactivity timeout
 */
StaleSession = {
  pinLockManager: new PinLockManager(),
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
    var expirationCheckFn = function () {
      if (this.sessionExpired && Meteor.userId()) {
        this.onSessionExpiration();
        this.pinLockManager.lockWithPin();
      } else {
        if (this.timeFromLastActivity >= this.inactivityTimeout) {
          this.sessionExpired = true;
        }
      }
    };

    var self = this;
    this.pinLockManager.checkPinTokens(function () {
      Meteor.setInterval(expirationCheckFn.bind(self), self.heartbeatInterval);
    });
  }
};

Meteor.startup(function () {
  StaleSession.lastActivity = new Date();

  $(document).on(StaleSession.activityEvents, function () {
    StaleSession.lastActivity = new Date();
  });

  StaleSession.start();
});