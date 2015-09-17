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
        var orgId = Session.get('organizationId');
        var count = Locations.find({organizationId: orgId, name: newValue}).count();
        if(count == 0) {
          Meteor.call("updateLocationName", id, newValue, function(err) {
            if(err) {
              console.log(err);
              return alert(err.error);
            }
          });
        } else {
          return alert("The location with name " + newValue + " already exists!");
        }
      }
    }
  });
});