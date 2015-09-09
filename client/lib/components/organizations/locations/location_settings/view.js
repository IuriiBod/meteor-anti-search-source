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
  }
});