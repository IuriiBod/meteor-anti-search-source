StaleSession = {

  // inactivityTimeout
  get inactivityTimeout() {
    return Session.get("StaleSession.inactivityTimeout");
  },
  set inactivityTimeout(val) {
    Session.set("StaleSession.inactivityTimeout", val);
  },

  // heartbeatInterval
  get heartbeatInterval() {
    return Session.get("StaleSession.heartbeatInterval");
  },
  set heartbeatInterval(val) {
    Session.set("StaleSession.heartbeatInterval", val);
  },

  // activityEvents
  get activityEvents() {
    return Session.get("StaleSession.activityEvents");
  },
  set activityEvents(val) {
    Session.set("StaleSession.activityEvents", val);
  },

  // sessionExpired
  get sessionExpired() {
    return Session.get("StaleSession.sessionExpired")
  },
  set sessionExpired(val) {
    Session.set("StaleSession.sessionExpired", val)
  },

  lastActivity: new Date(),

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
  StaleSession.configure({
    inactivityTimeout: 600000,
    heartbeatInterval: 500,
    activityEvents: "mousemove click keydown touchstart touchend"
  });
  StaleSession.lastActivity = new Date();
  $(document).on(StaleSession.activityEvents, function() {
    StaleSession.lastActivity = new Date();
  });
  StaleSession.start();
});