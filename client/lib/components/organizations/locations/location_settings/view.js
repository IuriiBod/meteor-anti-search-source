Template.locationSettings.events({
  'click .delete-location': function (e) {
    if (confirm("Are you sure, you want to delete this location?")) {
      var id = e.target.dataset.id;
      FlowComponents.callAction('deleteLocation', id);
      $("#locationSettings").removeClass('show');
    }
  },

  'click .create-area-flyout': function () {
    FlowComponents.callAction('openCreateAreaFlyout');
  }
});

Template.locationSettings.onRendered(function () {
  $('.location-name').editable({
    type: "text",
    title: 'Edit location name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function (response, newValue) {
      var id = this.dataset.id;
      if (id) {
        var location = Locations.findOne({_id: id});
        location.name = newValue;
        Meteor.call('editLocation', location, HospoHero.handleMethodResult());
      }
    }
  });
});