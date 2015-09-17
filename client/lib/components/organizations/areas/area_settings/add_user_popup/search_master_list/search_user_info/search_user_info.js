Template.searchUserInfo.helpers({
  'getProfilePhoto': function() {
    if(this.services && this.services.google && this.services.google.picture) {
      return this.services.google.picture;
    } else {
      return '/images/user-image.jpeg';
    }
  }
});

//Template.searchUserInfo.events({
//  'click .search-user-info-content': function() {
//    var id = this._id;
//    var user = Meteor.users.findOne({_id: id}, {fields: {username: 1}});
//    $('.user-permissions').find('.permission-for').text(user.username);
//  }
//});