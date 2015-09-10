Template.areaSettings.events({
  'click .delete-area': function(e) {
    if(confirm("Are you sure, you want to delete this area?")) {
      var id = e.target.dataset.id;
      Meteor.call('deleteArea', id, function(err) {
        if(err) {
          console.log(err);
          alert(err.reason);
        }
      });
      $("#areaSettings").removeClass('show');
      Session.set('areaId', '');

      var currentAreaId = Session.get('currentAreaId');
      if(currentAreaId == id) {
        Session.set('currentAreaId', '');
      }
    }
  }
});

Template.areaSettings.onRendered(function() {
  $('.area-name').editable({
    type: "text",
    title: 'Edit area name',
    showbuttons: true,
    mode: 'inline',
    success: function(response, newValue) {
      var id = Session.get('areaId');
      if(id) {
        Meteor.call("updateAreaName", id, newValue, function(err) {
          if(err) {
            console.log(err);
            return alert(err.error);
          }
        });
      }
    }
  });
});