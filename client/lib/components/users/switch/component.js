var component = FlowComponents.define("switchUser", function(props) {
  this.set("users", props.users);
});

component.action.logout = function() {
  Meteor.logout();
  Router.go("signIn");
};

component.action.switchUser = function(userId) {
  Router.go('pinLock', {userId: userId});
};