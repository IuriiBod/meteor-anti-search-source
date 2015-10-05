var securityHelpers = {
  isInOrganization: HospoHero.isInOrganization,
  isOrganizationOwner: HospoHero.isOrganizationOwner,
  getOrganization: HospoHero.getOrganization,
  isManager: HospoHero.isManager,
  isWorker: HospoHero.isWorker,
  getCurrentArea: HospoHero.getCurrentArea,
  getCurrentAreaId: HospoHero.getCurrentAreaId,
  isMe: HospoHero.isMe,
  canInvite: HospoHero.perms.canUser('invite')(),
  canViewRoster: HospoHero.perms.canUser('viewRoster')(),
  canEditRoster: HospoHero.perms.canUser('editRoster')(),
  canViewMenu: HospoHero.perms.canUser('viewMenu')(),
  canEditMenu: HospoHero.perms.canUser('editMenu')(),
  canViewJob: HospoHero.perms.canUser('viewJob')(),
  canEditJob: HospoHero.perms.canUser('editJob')(),
  canViewStock: HospoHero.perms.canUser('viewStock')(),
  canEditStock: HospoHero.perms.canUser('editStock')(),
  canViewForecast: HospoHero.perms.canUser('viewForecast')()
};

Object.keys(securityHelpers).forEach(function (helperName) {
  Template.registerHelper(helperName, securityHelpers[helperName]);
});