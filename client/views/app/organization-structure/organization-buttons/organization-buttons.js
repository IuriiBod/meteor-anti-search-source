Template.organizationButtons.helpers({
  hasLocations: function () {
    var locations = Template.instance().locations();
    return locations && locations.count() > 0;
  }
});
Template.organizationButtons.events({
  'click .organization-details-flyout': function (event, tmpl) {
    FlyoutManager.open('organizationDetailsPage', {organizationId: tmpl.data.organizationId});
  },

  'click .create-location-flyout': function (event, tmpl) {
    FlyoutManager.open('createLocation', {organizationId: tmpl.data.organizationId});
  },

  'click .create-area-flyout': function (event, tmpl) {
    FlyoutManager.open('createArea', {organizationId: tmpl.data.organizationId, locationId: null});
  }
});