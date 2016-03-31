let RoutePermissionChecker = class RoutePermissionChecker {
  constructor(routeInstance) {
    this._user = Meteor.user();

    let routeName = routeInstance.route.getName();
    this._currentRoutePermission = RoutePermissionChecker._permissionsByRouteName[routeName];
    this._permissionChecker = new HospoHero.security.PermissionChecker();
  }

  checkRoutePermissions() {
    return this._checkCurrentAreaNotArchived() && this._checkUserPermissionForRoute();
  }

  _checkUserPermissionForRoute() {
    let permission = this._currentRoutePermission;
    return permission && this._permissionChecker.hasPermissionInArea(null, permission) || !permission;
  }

  _checkCurrentAreaNotArchived() {
    if (this._user.currentAreaId && Areas.findOne()) {
      return !!Areas.findOne({_id: this._user.currentAreaId, archived: {$ne: true}});
    } else {
      //in case if there is no areas yet we return true
      //because we will be able to check user permissions
      //again after subscriptions will be finished
      return true;
    }
  }

  checkIsUserInOrganization() {
    return HospoHero.security.isUserInAnyOrganization();
  }

  isOrganizationOwner() {
    return HospoHero.security.isCurrentOrganizationOwner();
  }
};


RoutePermissionChecker._permissionsByRouteName = {
  // routeName : 'permission to check',
  teamHours: 'edit roster',
  weeklyRoster: 'view roster',
  templateWeeklyRoster: 'edit roster',
  stocktake: 'edit stocks',
  stocktakeCounting: 'edit stocks',
  orderReceive: 'receive deliveries',
  stocktakeOrdering: 'receive deliveries'
};


let requireLogIn = function () {
  if (Meteor.loggingIn()) {
    this.render(this.loadingTemplate);
  } else if (Meteor.userId()) {
    var permissionChecker = new RoutePermissionChecker(this);

    if (permissionChecker.checkIsUserInOrganization()) {
      if (permissionChecker.checkRoutePermissions()) {
        return this.next();
      } else {
        Router.go('dashboard');
        return this.next();
      }
    } else {
      // if user isn't invited to any organization
      Router.go('createOrganization');
      return this.next();
    }
  } else {
    let goOptions = {};
    let backwardUrl = HospoHero.misc.getBackwardUrl();
    let backwardUrlParameter = 'enableBackwardsUrl=true';
    let enableBackwardUrl = backwardUrl.includes(backwardUrlParameter);

    if (enableBackwardUrl && backwardUrl !== '/' && backwardUrl !== '/logout') {
      backwardUrl = backwardUrl.replace(backwardUrlParameter, '');
      goOptions.query = `backwardUrl=${backwardUrl}`;
    }

    //if we have PIN locked users => go to pin lock
    let pinLockedUsers = StaleSession.pinLockManager.getStoredUsersIds();
    if (pinLockedUsers.length > 0) {
      if (pinLockedUsers.length === 1) {
        //there is only one use can be logged in with pin
        Router.go('pinLock', {userId: pinLockedUsers[0]}, goOptions);
      } else {
        //we don't know who want to log in with pin
        Router.go('switchUser', {}, goOptions);
      }
    } else {
      Router.go('signIn', {}, goOptions);
      return this.next();
    }
  }
};

let publicRoutes = ['signIn', 'signUp', 'invitationAccept', 'switchUser', 'claim', 'pinLock', 'forgotPassword', 'recruitmentForm'];
Router.onBeforeAction(requireLogIn, {except: publicRoutes});