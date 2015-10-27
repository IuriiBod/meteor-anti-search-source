Template.locationSettings.events({
  'click .delete-location': function(e) {
    if(confirm("Are you sure, you want to delete this location?")) {
      var id = e.target.dataset.id;
      FlowComponents.callAction('deleteLocation', id);
      $("#locationSettings").removeClass('show');
    }
  },

  'click .open-flyout': function(e) {
    var locId;
    locId = e.target.dataset.locationId;
    $('select[name="locationId"]>option[value='+locId+']').prop("selected", true);
  }
});

Template.locationSettings.onRendered(function() {
  $('.location-name').editable({
    type: "text",
    title: 'Edit location name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function(response, newValue) {
      var id = this.dataset.id;
      if(id) {
        Meteor.call("updateLocationName", id, newValue, HospoHero.handleMethodResult());
      }
    }
  });
});