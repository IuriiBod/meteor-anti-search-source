var component = FlowComponents.define("userBio", function (props) {
  this.set("user", props.user);
  this.onClick = props.onClick;
});

component.state.userId = function () {
  var user = this.get("user");
  if (user) {
    return user._id;
  }
};

component.state.image = function () {
  var user = this.get("user");
  if (user) {
    if (user.services && user.services.google) {
      return user.services.google.picture;
    } else {
      return "/images/user-image.jpeg";
    }
  }
};

component.action.onClick = function () {
  if (_.isFunction(this.onClick)) {
    var user = this.get("user");
    this.onClick(user._id);
  }
};