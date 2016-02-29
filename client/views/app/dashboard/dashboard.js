Template.dashboard.helpers({
  isUserInAnyOrganization: function () {
    return HospoHero.security.isUserInAnyOrganization();
  },
  isCurrentOrganizationOwner: function () {
    return HospoHero.security.isCurrentOrganizationOwner();
  }
});
