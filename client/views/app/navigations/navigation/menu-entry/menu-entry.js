Template.menuEntry.helpers({
  title: function () {
    return this.title;
  },

  icon: function () {
    return this.icon || false;
  },

  subMenuItems: function () {
    return this.subMenuEntries || false;
  },

  subMenuItemsCount: function () {
    var subMenusItems = this.subMenuEntries;

    if (subMenusItems) {
      subMenusItems = subMenusItems.filter(function (item) {
        return checkPermission(item.permission);
      });
    }

    return subMenusItems && subMenusItems.length || false;
  },

  hrefPath: function () {
    var route = this.route;
    var paramsFn = this.params;
    var params = _.isFunction(paramsFn) && paramsFn();
    return route && Router.path(route, params) || '#';
  },

  permission: function (permission) {
    permission = permission || this.permission;
    return checkPermission(permission);
  },

  activeOnRoutes: function () {
    var activeOnRoutes = this.activeOnRoutes || this.route;

    return _.isArray(activeOnRoutes) && activeOnRoutes.join('|') || activeOnRoutes;
  },

  hasRoute: function () {
    return !!(this.activeOnRoutes || this.route);
  }
});

Template.menuEntry.events({
  'click .menu-entry-title': function (event, tmpl) {
    showSubMenu(tmpl);
    if (isMobile() && !haveSubMenu(event)) {
      hideSideMenu();
    }

    if (tmpl.data.callback) {
      tmpl.data.callback();
    }
  }
});

//HELPING FUNCTIONS

var isMobile = function () {
  return window.matchMedia('(max-width: 767px)').matches;
};

var haveSubMenu = function (event) {
  return !!$(event.currentTarget).next()[0];
};

var showSubMenu = function (tmpl) {
  $('.nav-first-level-item').removeClass('show-sub-menu');  //removing class from all menus
  tmpl.$('.nav-first-level-item').addClass('show-sub-menu'); //adding class to clicked menu
};


var hideSideMenu = function () {
  $('#wrapper').removeClass('force-show-sidebar').addClass('force-hide-sidebar');
};


var checkPermission = function (permission) {
  // If permission property is absent, render this menu entry
  if (!permission) {
    return true;
  }

  var checker = new HospoHero.security.PermissionChecker();

  return checker.hasPermissionInArea(null, permission);
};