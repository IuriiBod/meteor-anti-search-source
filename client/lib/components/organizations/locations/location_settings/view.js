Template.locationSettings.events({
  'click .delete-location': function(e) {
    if(confirm("Are you sure, you want to delete this location?")) {
      var id = e.target.dataset.id;
      Meteor.call('deleteLocation', id, function(err) {
        if(err) {
          console.log(err);
          alert(err.reason);
        }
      });
      $("#locationSettings").removeClass('show');
      Session.set('locationId', '');
    }
  },

  'click .open-flyout': function(e) {
    var id = e.target.dataset.id;
    $("#"+id).css('z-index', 10000).addClass("show");
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
      var id = Session.get('locationId');
      if(id) {
        Meteor.call("updateLocationName", id, newValue, function(err) {
          if(err) {
            console.log(err);
            return alert(err.error);
          }
        });
      }
    }
  });
});