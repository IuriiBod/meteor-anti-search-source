var subs = new SubsManager();

var component = FlowComponents.define("notifiFlyout", function(props) {
  return subs.subscribe("newNotifications");
});

component.state.count = function() {
  return Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}}).count();
};

component.state.notifications = function() {
  return Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 5});
};