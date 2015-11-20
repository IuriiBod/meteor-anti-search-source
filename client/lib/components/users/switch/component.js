var component = FlowComponents.define("switchUser", function(props) {
  this.set("users", props.users);
});

component.action.logout = function() {
  Meteor.logout();
  Router.go("signIn");
};

component.action.switchUser = function(userId) {
  var loggedUsers = Session.get("loggedUsers");
  var token = loggedUsers[userId];
  Meteor.loginWithToken(token, HospoHero.handleMethodResult(function () {
    Router.go("pinLock");
  }));
};