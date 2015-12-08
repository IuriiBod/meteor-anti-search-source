Template.switchUser.onCreated(function() {
  this.set('users', this.data.users);
});

Template.switchUser.helpers({
  switchUserOnClick: function() {
    var switchUser = function(userId) {
      Meteor.logout();
      Router.go('pinLock', {userId: userId});
    };
    return switchUser;
  }
});

Template.switchUser.events({
  "click .other-user": function () {
    Meteor.logout();
    Router.go("signIn");
  }
});