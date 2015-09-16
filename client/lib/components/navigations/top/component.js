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
  var areaId = Session.get('currentAreaId');
  if(areaId) {
    var area = Areas.findOne({_id: areaId}, {fields: {name: 1}});
    if(area) {
      return area.name;
    }
  }
};

component.state.relation = function() {
  var userId = Meteor.userId();
  if(userId) {
    var relation = Relations.findOne({collectionName: 'users', entityId: userId});
    return relation;
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
  var organization = this.get('organization');
  var userId = Meteor.userId();
  if(organization && userId) {
    return (organization.owner == userId);
  }
};

component.state.belongToOrganization = function() {
  var relation = this.get('relation');
  if(relation) {
    return true;
  } else {
    return false;
  }
};

component.state.hasLocations = function() {
  var organization = this.get('organization');
  if(organization) {
    var orgId = organization._id;
    var count = Locations.find({organizationId: orgId}).count();
    return (count > 0);
  }
};