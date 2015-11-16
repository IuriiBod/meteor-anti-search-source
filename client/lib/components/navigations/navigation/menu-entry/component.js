var component = FlowComponents.define('menuEntry', function (props) {
  this.menuEntry = props.menuEntry;
});

component.state.title = function () {
  return this.menuEntry.title;
};

component.state.icon = function () {
  return this.menuEntry.icon || false;
};

component.state.subMenuItems = function () {
  return this.menuEntry.subMenuEntries || false;
};

component.state.subMenuItemsCount = function () {
  var subMenusItems = this.menuEntry.subMenuEntries;

  if(subMenusItems) {
    subMenusItems = subMenusItems.filter(function(item) {
      return checkPermission(item.permission);
    });
  }

  return subMenusItems && subMenusItems.length || false;
};

component.state.hrefPath = function () {
  var route = this.menuEntry.route;
  var paramsFn = this.menuEntry.params;
  var params = _.isFunction(paramsFn) && paramsFn();
  return route && Router.path(route, params) || '#';
};

component.state.permission = function (permission) {
  permission = permission || this.menuEntry.permission;
  return checkPermission(permission);
};

component.state.activeOnRoutes = function () {
  var activeOnRoutes = this.menuEntry.activeOnRoutes || this.menuEntry.route;

  return _.isArray(activeOnRoutes) && activeOnRoutes.join('|') || activeOnRoutes;
};


var checkPermission = function (permission) {
  // If permission property is absent, render this menu entry
  if (!permission) {
    return true;
  }
  return HospoHero.canUser(permission, Meteor.userId());
};