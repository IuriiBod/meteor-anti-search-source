var component = FlowComponents.define("comment", function(props) {
  this.comment = props.comment;
  this.userDetails();
});

component.prototype.userDetails = function() {
  var user = Meteor.users.findOne(this.comment.createdBy);
  if(user) {
    var image = "/images/user-image.jpeg";
    if(user.services && user.services.google) {
      image = user.services.google.picture;
    }
    this.set("profileImage", image);
  }
};

component.state.createdBy = function() {
  return this.comment.createdBy;
};

component.state.text = function() {
  return this.comment.text;
};

component.state.createdOn = function() {
  return this.comment.createdOn;
};