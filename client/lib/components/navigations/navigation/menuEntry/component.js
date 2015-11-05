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

component.state.pathForMenuItem = function() {
    var route = this.menuEntry.route || null;
    if (!route) {
        return '#';
    }

    var params = this.menuEntry.params || {};
    if (_.isFunction(params)) {
        params = params();
    };

    return Router.path(route, params);
};

component.state.permission = function() {
    var permission = this.menuEntry.permission || null;

    // If permission property is absent, render this menu entry
    if (!permission) {
        return true;
    };

    if (permission.canUser) {
        return HospoHero.canUser(permission)(Meteor.userId());
    } else if (permission.isUser) {
        switch(permission.isUser) {
            case 'isManager': return HospoHero.isManager(); break;
            case 'isOrganizationOwner': return HospoHero.isOrganizationOwner(); break;
            default: return false;
        }
    }

    return false;
};

component.state.activeOnRoutes = function() {
    var activeOnRoutes = this.menuEntry.activeOnRoutes || this.menuEntry.route;
    if (_.isString(activeOnRoutes)) {
        return activeOnRoutes;
    } else if (_.isArray(activeOnRoutes)) {
        return activeOnRoutes.join('|');
    }
};