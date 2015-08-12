StaleSession = new function () {
  var self = this;

  self.configure = function (kwargs) {
    kwargs = kwargs || {};
    self.inactivityTimeout = kwargs.inactivityTimeout || 600000;
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
    Session.set('sessionExpired', false);
    self.onReset();
  };

  var tick = function () {
    var isExpired = Session.get('sessionExpired');
    if (isExpired) {
      return;
    }
    var interval = new Date() - self.lastActivity;
    if (interval >= self.inactivityTimeout) {
      Session.set('sessionExpired', true);
      self.onSessionExpiration();
    }
    Meteor.setTimeout(tick.bind(self), self.heartbeatInterval);
  };

  Meteor.startup(function () {
    $(document).on(self.activityEvents, function() {
      self.lastActivity = new Date();
    });
    tick();
  });
}();