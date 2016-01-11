Meteor.startup(function () {
  var securityHelpers = {
    isInOrganization: HospoHero.isInOrganization,
    isOrganizationOwner: HospoHero.isOrganizationOwner,
    getOrganization: HospoHero.getOrganization,
    isManager: HospoHero.isManager,
    isWorker: HospoHero.isWorker,
    getCurrentArea: HospoHero.getCurrentArea,
    getCurrentAreaId: HospoHero.getCurrentAreaId,
    isMe: HospoHero.isMe,
    canBeRosted: HospoHero.canUser('be rosted'),
    canInvite: HospoHero.canUser('invite users'),
    canViewRoster: HospoHero.canUser('view roster'),
    canEditRoster: HospoHero.canUser('edit roster'),
    canViewMenu: HospoHero.canUser('view menus'),
    canEditMenu: HospoHero.canUser('edit menus'),
    canViewJob: HospoHero.canUser('view jobs'),
    canEditJob: HospoHero.canUser('edit jobs'),
    canViewStock: HospoHero.canUser('view stocks'),
    canEditStock: HospoHero.canUser('edit stocks'),
    canViewForecast: HospoHero.canUser('view forecast'),
    canEditUsers: HospoHero.canUser('edit users'),
    canViewReports: HospoHero.canUser('view reports')
  };

  Object.keys(securityHelpers).forEach(function (helperName) {
    Template.registerHelper(helperName, securityHelpers[helperName]);
  });
});