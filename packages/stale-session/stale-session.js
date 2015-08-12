StaleSession = new function () {
  var self = this;

  self.configure = function (kwargs) {
    kwargs = kwargs || {};
    self.inactivityTimeout = kwargs.inactivityTimeout || 60000;
    self.heartbeatInterval = kwargs.heartbeatInterval || 500;
    self.activityEvents = kwargs.activityEvents ||
      'mousemove click keydown touchstart touchend';
    self.onSessionExpiration = kwargs.onSessionExpiration || function () {};
    self.onReset = kwargs.onReset || function () {};
  };

  // Configure first time
  self.configure();

  self.reset = function () {
    self.lastActivity = new Date();
    Session.set('sessionExpiration', false);
    self.onReset();
  };

  var tick = function () {
    var interval = new Date() - self.lastActivity;
    if (interval >= self.inactivityTimeout) {
      Session.set('sessionExpiration', true);
      self.onSessionExpiration();
    }
    else {
      Session.set('sessionExpiration', false);
    }
    Meteor.setTimeout(tick.bind(self), self.heartbeatInterval);
  };

  Meteor.startup(function () {
    Session.set('sessionExpiration', false);
    $(document).on(self.activityEvents, function() {
      self.lastActivity = new Date();
    });
    tick();
  });
}();