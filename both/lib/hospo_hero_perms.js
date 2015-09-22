Namespace('HospoHero.perms', {
  canInvite: function() {
    return HospoHero.isOrganizationOwner() || Roles.hasPermission(Roles.permissions.User.invite);
  }
});