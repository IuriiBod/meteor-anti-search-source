let RoutePermissionChecker = class RoutePermissionChecker {
  constructor(routeInstance) {
    this._user = Meteor.user();
    this._routeName = routeInstance.route.getName();
  }

  isOrganizationOwner() {
    return !!Organizations.findOne({owners: this._user._id});
  }

  checkRoutePermissions() {
    return this._checkCurrentAreaNotArchived() && this._checkUserPermissionForRoute();
  }

  _checkUserPermissionForRoute() {
    const permission = RoutePermissionChecker._permissionsByRouteName[this._routeName];
    return permission && HospoHero.canUser(permission, this._user._id) || !permission;
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
    return HospoHero.isInOrganization(this._user._id);
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
  console.log('onBefore action');
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
      if (permissionChecker.isOrganizationOwner()) {
        return this.next();
      } else {
        Router.go('createOrganization');
        return this.next();
      }
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

    Router.go('signIn', {}, goOptions);
    return this.next();
  }
};

Router.onBeforeAction(requireLogIn, {except: ['signIn', 'signUp', 'invitationAccept', 'switchUser', 'claim', 'pinLock', 'forgotPassword']});