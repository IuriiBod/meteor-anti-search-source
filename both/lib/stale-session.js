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
      var routeName = Router.current().route.getName();
      var allowedRouters = ['pinLock', 'switchUser'];
      var isAllowedRouter = _.contains(allowedRouters, routeName);
      if (!isAllowedRouter) {
        var backwardUrl = HospoHero.misc.getBackwardUrl();
        Router.go('pinLock', {
          userId: userId
        }, {
          query: 'backwardUrl=' + backwardUrl
        });
      }
    };


    Accounts.onLogin(function () {
      StaleSession.reset();
    });
  });
}