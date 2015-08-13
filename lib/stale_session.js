if (Meteor.isClient) {
  Meteor.startup(function () {
    StaleSession.onSessionExpiration = function () {
      var userId = Meteor.userId();
      if (!userId) {
        return;
      }
      var currRouter = Router.current();
      var backwardUrl = '/';
      if (currRouter && currRouter.route) {
        var routeName = currRouter.route.getName();
        backwardUrl = currRouter.url;
      }
      if (routeName !== "pinLock") {
        Router.go("pinLock", {}, {
          query: "backwardUrl=" + backwardUrl.replace(Meteor.absoluteUrl(), '/')
        });
      }
    };
  });

  Accounts.onLogin(function () {
    StaleSession.reset();
  });
}


StaleSession.allowChangeSettings = function (userId) {
  var user = Meteor.users.findOne(userId) || {};
  return user.isAdmin;
};
