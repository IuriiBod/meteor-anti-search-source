Template.organizationButtons.helpers({
  hasLocations: function () {
    return !!Locations.findOne({organizationId: this._id});
  },
  isOwner: function () {
    let permissionChecker = new HospoHero.security.PermissionChecker();
    return permissionChecker.isOrganizationOwner(this._id);
  }
});

Template.organizationButtons.events({
  'click .organization-details-flyout': function (event, tmpl) {
    FlyoutManager.open('wrapperFlyout', {
      template: 'organizationDetailsPage',
      title: "Organization details",
      data: {organizationId: tmpl.data._id}
    });
  },

  'click .create-location-flyout': function (event, tmpl) {
    FlyoutManager.open('wrapperFlyout', {
      template: 'createLocation',
      title: " Add Location",
      data: {organization: tmpl.data}
    });
  },

  'click .create-area-flyout': function (event, tmpl) {
    FlyoutManager.open('wrapperFlyout', {
      template: 'createArea',
      title: "Add Area",
      data: {organizationId: tmpl.data._id}
    });
  }
});