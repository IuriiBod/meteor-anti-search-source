Meteor.startup(function () {
  StaleSession.onSessionExpiration = function () {
    var userId = Meteor.userId();
    if (_.isUndefined(userId)) {
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
        query: "backwardUrl=" + backwardUrl
      });
    }
  };
});

Accounts.onLogin(function () {
  StaleSession.reset();
});
