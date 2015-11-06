var RoutePermissionChecker = function (routeInstance) {
  this._user = Meteor.user();
  this._routeName = routeInstance.route.getName();
};

RoutePermissionChecker.prototype.isOrganizationOwner = function () {
  return !!Organizations.findOne({owner: this._user._id});
};

RoutePermissionChecker.prototype.checkRoutePermissions = function () {
  return this._checkCurrentAreaNotArchived() && this._checkUserPermissionForRoute();
};

RoutePermissionChecker.prototype._checkUserPermissionForRoute = function () {
  var permission = this._permissionsByRouteName[this._routeName];
  return permission && HospoHero.canUser(permission, this._user._id) || !permission;
};

RoutePermissionChecker.prototype._checkCurrentAreaNotArchived = function () {
  return this._user.currentAreaId && Areas.findOne({_id: this._user.currentAreaId, archived: {$ne: "true"}});
};

RoutePermissionChecker.prototype.checkIsUserInOrganization = function () {
  return this._user.relations && this._user.relations.organizationId;
};

RoutePermissionChecker.prototype._permissionsByRouteName = {
  // route_name : 'permission to check',
  teamHours: 'edit roster',
  currentStocks: 'edit roster'
  //todo: add other routes and their permissions
};


var requireLogIn = function () {
  if (Meteor.loggingIn()) {
    this.render(this.loadingTemplate);
  } else if (Meteor.userId()) {
    var permissionChecker = new RoutePermissionChecker(this);

    if (permissionChecker.checkIsUserInOrganization()) {
      if (permissionChecker.checkRoutePermissions()) {
        return this.next();
      } else {
        Router.go("home");
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
    Router.go('signIn');
    return this.next();
  }
};


Router.onBeforeAction(requireLogIn, {except: ['signIn', 'signUp', 'invitationAccept', 'switchUser']});