Meteor.startup(function () {
  StaleSession.onSessionExpiration = function () {
    var user = Meteor.user();
    if (!user || !user.profile.pinLock) {
      return;
    }
    var currRouter = Router.current();
    if (!currRouter) {
      return;
    }
    var routeName = currRouter.route.getName();
    if (routeName && routeName !== 'pinLock') {
      var backwardUrl = currRouter.url || '/';
      Router.go('pinLock', {}, {
        query: 'backwardUrl=' + backwardUrl
      });
    }
  };
});
