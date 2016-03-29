Template.switchUser.helpers({
  switchUserOnClick: function () {
    return function (userId) {
      Router.go('pinLock', {userId: userId});
    };
  }
});

Template.switchUser.events({
  "click .other-user": function () {
    Router.go("signIn");
  }
});