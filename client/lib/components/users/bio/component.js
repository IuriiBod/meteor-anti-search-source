var component = FlowComponents.define("userBio", function (props) {
  this.set("user", props.user);
});

component.state.username = function () {
  var user = this.get("user");
  if (user) {
    return user.username;
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