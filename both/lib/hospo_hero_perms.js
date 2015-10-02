Namespace('HospoHero.perms', {
  canInvite: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.User.invite.code);
  },

  canViewRoster: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.Roster.view.code);
  },

  canEditRoster: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.Roster.edit.code);
  },

  canBeRosted: function () {
    return Roles.hasPermission(Roles.permissions.Roster.canBeRosted.code);
  },

  canViewMenu: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.Menu.view.code);
  },

  canEditMenu: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.Menu.edit.code);
  },

  canViewJob: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.Job.view.code);
  },

  canEditJob: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.Job.edit.code);
  },

  canViewStock: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.Stock.view.code);
  },

  canEditStock: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.Stock.edit.code);
  },

  canViewForecast: function () {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.Forecast.view.code);
  }
});