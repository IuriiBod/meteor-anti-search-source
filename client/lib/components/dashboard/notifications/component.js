var subs = new SubsManager();

var component = FlowComponents.define("notificationsList", function(props) {
  this.onRendered(this.onListRendered);
  subs.subscribe("readNotifications");
});

component.state.notifications = function() {
  var state = Session.get("notifiState");
  return Notifications.find({"read": state, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 10});
};

component.prototype.onListRendered = function() {
  if(Session.get("notifiState")) {
    $(".readNoti").addClass("label-primary");
  } else {
    $(".newNoti").addClass("label-primary");
  }
};