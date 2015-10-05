var securityHelpers = {
  isInOrganization: HospoHero.isInOrganization,
  isOrganizationOwner: HospoHero.isOrganizationOwner,
  getOrganization: HospoHero.getOrganization,
  isManager: HospoHero.isManager,
  isWorker: HospoHero.isWorker,
  getCurrentArea: HospoHero.getCurrentArea,
  getCurrentAreaId: HospoHero.getCurrentAreaId,
  isMe: HospoHero.isMe,
  canInvite: HospoHero.perms.canInvite,
  canViewRoster: HospoHero.perms.canViewRoster,
  canEditRoster: HospoHero.perms.canEditRoster,
  canViewMenu: HospoHero.perms.canViewMenu,
  canEditMenu: HospoHero.perms.canEditMenu,
  canViewJob: HospoHero.perms.canViewJob,
  canEditJob: HospoHero.perms.canEditJob,
  canViewStock: HospoHero.perms.canViewStock,
  canEditStock: HospoHero.perms.canEditStock,
  canViewForecast: HospoHero.perms.canViewForecast
};

Object.keys(securityHelpers).forEach(function (helperName) {
  Template.registerHelper(helperName, securityHelpers[helperName]);
});