var subs = new SubsManager();

var component = FlowComponents.define("notifiText", function(props) {
  this.notification = props.noti;
  this.onRendered(this.onItemRendered);
});

component.state.notifi = function() {
  if(this.notification) {
    return this.notification;
  }
}

component.state.icon = function() {
  if(this.notification) {
    var type = this.notification.type;
    if(type == "job") {
      return "spoon";
    } else if(type == "menu") {
      return "cutlery";
    } else if(type == "comment") {
      return "comment";
    } else if (type == "roster") {
      return "calendar-o"
    }
  }
}

component.state.createdByImage = function() {
  var createdBy = this.notification.createdBy;
  var user = Meteor.users.findOne({_id: createdBy});
  var image = '/images/user-image.jpeg';
  if(user && user.services) {
    if(user.services.google) {
      image = user.services.google.picture;
    }
  } 
  return image;
}

component.prototype.onItemRendered = function() {
  if(this.notification.type == "roster" && this.notification.actionType != "publish") {
    subs.subscribe("shift", this.notification.ref);
  }
}
