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
  },

  'click .add-user': function() {
    $('.add-user-popup').toggleClass('show').toggleClass('hide');
    $('input[name="add-user-name"]').val('').focus();
    $('.add-user-info').show();
    $('.users-search-results').hide();
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
        var locId = Session.get('locationId');
        var count = Areas.find({locationId: locId, name: newValue}).count();
        if(count == 0) {
          Meteor.call("updateAreaName", id, newValue, function(err) {
            if(err) {
              console.log(err);
              return alert(err.error);
            }
          });
        } else {
          return alert("The area with name "+newValue+" already exists!");
        }
      }
    }
  });
});