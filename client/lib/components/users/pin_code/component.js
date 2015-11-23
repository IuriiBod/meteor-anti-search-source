var component = FlowComponents.define('pinCode', function(props) {
  var userId = Router.current().params.userId;
  var user = Meteor.users.findOne(userId);
  this.set("user", user);
  this.set("backwardUrl", props.backwardUrl);
});

component.state.image = function() {
  var user = this.get("user");
  if(user) {
    if(user.services && user.services.google) {
      return user.services.google.picture;
    } else {
      return "/images/user-image.jpeg";
    }
  }
};

component.action.inputPinCode = function(pinCode) {
  var backwardUrl = this.get("backwardUrl") || '/';
  var userId = this.get('user')._id;

  Meteor.call("inputPinCode", userId, pinCode, HospoHero.handleMethodResult(function () {
    var loggedUsers = Session.get("loggedUsers");
    var token = loggedUsers[userId];
    Meteor.loginWithToken(token, HospoHero.handleMethodResult(function() {
      Router.go(backwardUrl);
    }));
  }));
};

component.action.switchUser = function() {
  Router.go("switchUser");
};