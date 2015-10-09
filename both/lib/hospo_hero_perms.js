Namespace('HospoHero.perms', {
  canUser: function(permission) {
    var permissions = {
      invite: Roles.permissions.User.invite,
      viewRoster: Roles.permissions.Roster.view,
      editRoster: Roles.permissions.Roster.edit,
      viewMenu: Roles.permissions.Menu.view,
      editMenu: Roles.permissions.Menu.edit,
      viewJob: Roles.permissions.Job.view,
      editJob: Roles.permissions.Job.edit,
      viewStock: Roles.permissions.Stock.view,
      editStock: Roles.permissions.Stock.edit,
      viewForecast: Roles.permissions.Forecast.view
    };

    if(!permissions[permission]) {
      throw new Meteor.Error("Permission not found!");
    }

    return function(userId) {
      return HospoHero.isOrganizationOwner(userId) ||
        Roles.hasPermission(permissions[permission].code, userId);
    };
  },

  canBeRosted: function (userId) {
    return Roles.hasPermission(Roles.permissions.Roster.canBeRosted.code, userId);
  }
});