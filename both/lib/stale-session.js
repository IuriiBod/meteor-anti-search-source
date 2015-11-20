MeteorSettings.setDefaults({
  public: {
    persistent_session: {
      default_method: "temporary"
    }
  }
});


if (Meteor.isClient) {
  Meteor.startup(function () {
    StaleSession.onGetInactivityTimeout(function () {
      var area = HospoHero.getCurrentArea();
      return area && area.inactivityTimeout;
    });

    StaleSession.onSessionExpiration = function () {
      var userId = Meteor.userId();
      if (!userId) {
        return;
      }
      var routeName = Router.current().getName();
      var allowedRouters = ["pinLock", "switchUser"];
      var isAllowedRouter = _.contains(allowedRouters, routeName);
      if (!isAllowedRouter) {
        var backwardUrl = HospoHero.getBackwardUrl();
        Router.go("pinLock", {}, {
          query: "backwardUrl=" + backwardUrl
        });
      }
    };

    Accounts.onLogin(function () {
      StaleSession.reset();
      var users = Session.get("loggedUsers") || {};
      users[Meteor.userId()] = Accounts._storedLoginToken();
      Session.setPersistent("loggedUsers", users);
    });

    Meteor.logout = function () {
      Meteor._localStorage.removeItem("Meteor.loginToken");
      Meteor._localStorage.removeItem("Meteor.loginTokenExpires");
      Meteor._localStorage.removeItem("Meteor.userId");
      Accounts.connection.setUserId(null);
      Accounts.connection.onReconnect = null;
    };
  });
}