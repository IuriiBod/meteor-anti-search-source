if (Meteor.isClient) {
  Meteor.startup(function () {
    StaleSession.onSessionExpiration = function () {
      var userId = Meteor.userId();
      if (!userId) {
        return;
      }
      var currRouter = Router.current();
      var backwardUrl = "/";
      if (currRouter && currRouter.route) {
        var routeName = currRouter.route.getName();
        backwardUrl = currRouter.url;
      }
      var allowedRouters = ["pinLock", "switchUser"];
      var isAllowedRouter = _.contains(allowedRouters, routeName);
      if (!isAllowedRouter) {
        Router.go("pinLock", {}, {
          query: "backwardUrl=" + backwardUrl.replace(Meteor.absoluteUrl(), "/")
        });
      }
    };

    Accounts.onLogin(function () {
      StaleSession.reset();
      var users = Session.get("loggedUsers") || {};
      users[Meteor.userId()] = Accounts._storedLoginToken();
      Session.set("loggedUsers", users);
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

StaleSession.allowChangeSettings = function (userId) {
  var user = Meteor.users.findOne(userId) || {};
  return user.isAdmin;
};
