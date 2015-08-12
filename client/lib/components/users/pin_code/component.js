var component = FlowComponents.define('pinCode', function(props) {
  this.set("id", props.id);
  this.set("backwardUrl", props.backwardUrl);
});

component.state.basic = function() {
  var id = this.get("id");
  var user = Meteor.users.findOne(id);
  this.set("user", user);
  if(user) {
    return user;
  }
};

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
      console.log(err);
      return alert(err.reason);
    }
    else if (res) {
      StaleSession.reset();
      Router.go(backwardUrl);
    }
  });
};

component.action.switchUser = function() {
  Meteor.logout();
};