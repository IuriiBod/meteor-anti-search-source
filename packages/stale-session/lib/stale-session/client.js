StaleSession = {

  _getConfig: function(name, defaultVal) {
    var conf = StaleSessionConfigs.findOne({name: name});
    return conf ? conf.value : defaultVal;
  },

  _setConfig: function(name, value) {
    var conf = StaleSessionConfigs.findOne({name: name});
    if (conf && conf.value !== value) {
      StaleSessionConfigs.update({
        _id: conf._id
      }, {
        $set: {
          name: name,
          value: value
        }
      });
    }
    else {
      StaleSessionConfigs.insert({
        name: name,
        value: value
      });
    }
  },

  // inactivityTimeout
  get inactivityTimeout() {
    return this._getConfig("inactivityTimeout", 600000)
  },
  set inactivityTimeout(val) {
    this._setConfig("inactivityTimeout", val);
  },

  // heartbeatInterval
  get heartbeatInterval() {
    return this._getConfig("heartbeatInterval", 500);
  },
  set heartbeatInterval(val) {
    this._setConfig("heartbeatInterval", val);
  },

  // activityEvents
  get activityEvents() {
    var defaultVal = "mousemove click keydown touchstart touchend";
    return this._getConfig("activityEvents", defaultVal);
  },
  set activityEvents(val) {
    this._setConfig("activityEvents", val);
  },

  // sessionExpired
  get sessionExpired() {
    return Session.get("StaleSession.sessionExpired")
  },
  set sessionExpired(val) {
    Session.set("StaleSession.sessionExpired", val)
  },

  lastActivity: new Date(),

  allowChangeSettings: function () {
    return true;
  },

  onSessionExpiration: function () {},

  onReset: function () {},

  configure: function (kwargs) {
    kwargs = kwargs || {};
    kwargs = _.pick(
      kwargs,
      "inactivityTimeout",
      "heartbeatInterval",
      "activityEvents",
      "onSessionExpiration",
      "onReset"
    );
    var self = this;
    _.each(kwargs, function (val, key) {
      self[key] = val;
    });
  },

  reset: function () {
    this.lastActivity = new Date();
    this.sessionExpired = false;
    this.onReset();
  },

  start: function () {
    if (this.sessionExpired) {
      this.onSessionExpiration();
    }
    else {
      var interval = new Date() - this.lastActivity;
      if (interval >= this.inactivityTimeout) {
        this.sessionExpired = true;
      }
    }
    Meteor.setTimeout(this.start.bind(this), this.heartbeatInterval);
  }

};



Meteor.startup(function () {
  StaleSession.lastActivity = new Date();
  $(document).on(StaleSession.activityEvents, function() {
    StaleSession.lastActivity = new Date();
  });
  StaleSession.start();
});