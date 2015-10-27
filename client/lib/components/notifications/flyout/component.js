var component = FlowComponents.define("notifiFlyout", function () {});

component.state.count = function () {
  return Notifications.find({"read": false, "to": Meteor.userId()}).count();
};

component.state.notifications = function () {
  return Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}});
};
