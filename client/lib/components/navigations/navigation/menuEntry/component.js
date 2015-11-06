var component = FlowComponents.define('menuEntry', function (props) {
    this.menuEntry = props.menuEntry;
});

component.state.title = function() {
    return this.menuEntry.title;
};

component.state.icon = function() {
    return this.menuEntry.icon || false;
};

component.state.subMenuItems = function() {
    var subMenusItems = this.menuEntry.subMenuEntries || false;
    return subMenusItems;
};

component.state.subMenuItemsCount = function() {
    var subMenusItems = this.menuEntry.subMenuEntries || false;
    if (subMenusItems) {
        return subMenusItems.length;
    }
    return false;
};

component.state.route = function() {
    var route = this.menuEntry.route || '#';
    return route;
};

component.state.routeParams = function() {
    var params = this.menuEntry.params || {};
    if (_.isFunction(params)) {
        params = params();
    };
    return params;
};

component.state.permission = function() {
    var permission = this.menuEntry.permission || null;

    // If permission property is absent, render this menu entry
    if (!permission) {
        return true;
    };

    return HospoHero[permission.type](permission.action) || false;
};

component.state.activeOnRoutes = function() {
    var activeOnRoutes = this.menuEntry.activeOnRoutes || this.menuEntry.route;
    if (_.isString(activeOnRoutes)) {
        return activeOnRoutes;
    } else if (_.isArray(activeOnRoutes)) {
        return activeOnRoutes.join('|');
    }
};