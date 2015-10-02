var component = FlowComponents.define('pinCode', function(props) {
  var user = Meteor.users.findOne(props.id);
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
  Meteor.call("inputPinCode", pinCode, function (err, res) {
    if (err) {
      HospoHero.alert(err);
    }
    else if (res) {
      StaleSession.reset();
      Router.go(backwardUrl);
    }
  });
};

component.action.switchUser = function() {
  Router.go("switchUser");
};