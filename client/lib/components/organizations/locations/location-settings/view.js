Template.locationSettings.events({
  'click .delete-location': function (event) {
    if (confirm("Are you sure, you want to delete this location?")) {
      FlowComponents.callAction('deleteLocation', event);
    }
  },

  'click .create-area-flyout': function () {
    FlowComponents.callAction('openCreateAreaFlyout');
  }
});