var subs = new SubsManager();
var component = FlowComponents.define('topNavbar', function(props) {
  return subs.subscribe("newNotifications");
});


component.state.count = function() {
  var notifications = Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}}).fetch();
  var count = notifications.length;
  if(count) {
    return count;
  }
};

component.state.notifications = function() {
  return Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 5});
};

component.state.currentArea = function() {
  return HospoHero.getCurrentArea();
};

component.state.relation = function() {
  var user = Meteor.user();
  if(user && user.relations) {
    return user.relations;
  }
};

component.state.organization = function() {
  var relation = this.get('relation');
  if(relation) {
    var organization = Organizations.findOne({_id: relation.organizationId});
    return organization;
  }
};

component.state.isOrganizationOwner = function() {
  return HospoHero.isOrganizationOwner();
};

component.state.belongToOrganization = function() {
  return HospoHero.isInOrganization();
};

component.state.hasLocations = function() {
  var organization = this.get('organization');
  if(organization) {
    var orgId = organization._id;
    var count = Locations.find({organizationId: orgId}).count();
    return (count > 0);
  }
};