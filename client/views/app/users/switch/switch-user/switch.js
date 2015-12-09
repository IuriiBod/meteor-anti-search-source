Template.switchUser.onCreated(function() {
  this.set('users', this.data.users);
});

Template.switchUser.helpers({
  switchUserOnClick: function() {
    return function(userId) {
      Meteor.logout();
      Router.go('pinLock', {userId: userId});
    };
  }
});

Template.switchUser.events({
  "click .other-user": function () {
    Meteor.logout();
    Router.go("signIn");
  }
});