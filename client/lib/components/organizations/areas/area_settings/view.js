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
    $('input[name="addUserName"]').val('').focus();
    $('input[name="newUserName"]').val('').addClass('hide');
    $('.add-user-info').show();
    $('.users-search-results').hide();
  },

  'click .add-existing-user': function(e) {
    var userId = e.target.dataset.id;
    var areaId = Session.get('areaId');
    var area = Areas.find({_id: areaId});
    Meteor.call('addUserToArea', userId, areaId, function(err, area) {
      if(err) {
        console.log(err);
        return err.reason;
      }
      var options = {
        type: 'update',
        title: 'You\'ve been added to the '+area.name+' area.',
        to: userId
      };
      Meteor.call('sendNotifications', areaId, 'organization', options, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
        Meteor.call('notifyAddToArea', 'id', userId, area.name, Meteor.user(), function (err) {
          if(err) {
            console.log(err);
            return alert(err);
          }
        })
      });
    });
    $('.user-permissions').addClass('hide');
    $('.search-result').addClass('hide');
    $('.add-user-to-area-form').removeClass('hide');
    $('input[name="addUserName"]').val('').focus();
  },

  'click .back-to-select-user': function() {
    $('.user-permissions').addClass('hide');
    $('.add-user-to-area-form').removeClass('hide');
    $('.search-result').removeClass('hide');
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