Meteor.startup(function () {
  var securityHelpers = {
    isInOrganization: HospoHero.isInOrganization,
    isOrganizationOwner: HospoHero.isOrganizationOwner,
    getOrganization: HospoHero.getOrganization,
    getCurrentArea: HospoHero.getCurrentArea,
    getCurrentAreaId: HospoHero.getCurrentAreaId,

    hasPermissionInAreaTo: HospoHero.security.hasPermissionInAreaTo
  };

  Object.keys(securityHelpers).forEach(function (helperName) {
    Template.registerHelper(helperName, securityHelpers[helperName]);
  });
});