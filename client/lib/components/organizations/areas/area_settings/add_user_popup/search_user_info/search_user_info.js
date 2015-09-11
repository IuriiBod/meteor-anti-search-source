Template.searchUserInfo.helpers({
  'getUsername': function() {
    return this.username;
  },

  'getProfilePhoto': function() {
    if(this.services && this.services.google && this.services.google.picture) {
      return this.services.google.picture;
    } else {
      return '/images/user-image.jpeg';
    }
  }
});

Template.searchUserInfo.events({
  'click .search-user-info-content': function(e, tpl) {
    var userId = this._id;
    var areaId = Session.get('areaId');
    var area = Areas.find({_id: areaId});
    Meteor.call('addUserToRelation', userId, areaId, function(err, area) {
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
    $('.add-user-info').show();
    $('.users-search-results').hide();
    $('.add-user-popup').removeClass('show').addClass('hide');
    $('input[name="add-user-name"]').val('')
  }
});