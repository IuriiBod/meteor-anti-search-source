Template.areaSettings.events({
  'click .delete-area': function(e) {
    if(confirm("Are you sure, you want to delete this area?")) {
      var id = e.target.dataset.id;
      FlowComponents.callAction('deleteArea', id);
      $("#areaSettings").removeClass('show');
      var currentAreaId = Session.get('currentAreaId');
      if(currentAreaId == id) {
        Session.set('currentAreaId', '');
      }
    }
  },

  'click .add-user': function() {
    FlowComponents.callAction('toggleAddUser');
  },

  'mouseenter .user-profile-image-container': function(e) {
    $(e.target).find('.remove-user-from-area').css('opacity', 1);
  },

  'mouseleave .user-profile-image-container': function(e) {
    $(e.target).find('.remove-user-from-area').css('opacity', 0);
  },

  'click .remove-user-from-area': function(e) {
    var userId = this._id;
    var areaId = Session.get('areaId');
    Meteor.call('removeUserFromArea', userId, areaId, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    })
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