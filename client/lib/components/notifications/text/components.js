var component = FlowComponents.define("notifiText", function (props) {
  this.notification = props.noti;
  this.onRendered(this.onItemRendered);
});

component.state.notifi = function () {
  if (this.notification) {
    return this.notification;
  }
};

component.state.createdByImage = function () {
  var createdBy = this.notification.createdBy;
  var user = Meteor.users.findOne({_id: createdBy});
  var image = '/images/user-image.jpeg';
  if (user && user.services) {
    if (user.services.google) {
      image = user.services.google.picture;
    }
  }
  return image;
};

component.prototype.onItemRendered = function () {
  if (this.notification.type == "roster" && this.notification.ref) {
    Meteor.subscribe("shift", this.notification.ref);
  }
};