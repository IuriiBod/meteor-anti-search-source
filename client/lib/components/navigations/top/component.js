var subs = new SubsManager();
var component = FlowComponents.define('topNavbar', function(props) {
  return subs.subscribe("newNotifications");
});


component.state.count = function() {
  var notifications = Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}}).fetch();
  var count = notifications.length
  if(count) {
    return count;
  }
};

component.state.notifications = function() {
  var notifications = Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 5});
  return notifications;
};

component.state.hasOrganization = function() {
  var org = Relations.findOne();
  if(org) {
    Session.set('organizationId', org.organizationId);
    return true;
  } else {
    Session.set('organizationId', '');
    return false;
  }
};

component.state.userAreasAccess = function() {
  var content = [];
  var entityId = Session.get("areaId");
  var area;
  var organization;

  if(entityId) {
    area = Areas.findOne();
    if(area) {
      content.push('Area: <b>');
      content.push(area.name);
      content.push('</b>');
    }
  } else {
    entityId = Session.get("organizationId");
    organization = Organizations.findOne();
    if(organization) {
      content.push('Organization: <b>');
      content.push(organization.name);
      content.push('</b>');
    }
  }
  return content.join('');
};