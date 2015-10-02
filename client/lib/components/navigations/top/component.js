var component = FlowComponents.define('topNavbar', function(props) {});

component.state.count = function() {
  var notifications = Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}}).fetch();
  return notifications.length;
};

component.state.notifications = function() {
  return Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 5});
};

component.state.hasLocations = function() {
  var organizationId = HospoHero.isInOrganization();
  return Locations.find({organizationId: organizationId}).count() > 0
};