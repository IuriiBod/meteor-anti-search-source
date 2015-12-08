var component = FlowComponents.define("profileImage", function (props) {
  this.id = props.id;
});

component.state.image = function () {
  var doc = Meteor.users.findOne(this.id);
  if (doc) {
    if (doc.profile.image) {
      return doc.profile.image;
    } else if (doc.services && doc.services.google) {
      return doc.services.google.picture;
    } else {
      return "/images/user-image.jpeg";
    }
  }
};

component.state.imageExists = function () {
  var doc = Meteor.users.findOne(this.id);
  if (doc) {
    if (doc.profile.image) {
      return true;
    } else {
      return !!(doc.services && doc.services.google);
    }
  }
};

component.state.ifMe = function () {
  return Session.get("profileUser") == Meteor.userId();
};