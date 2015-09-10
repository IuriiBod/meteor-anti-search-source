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
  var notifications = Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 5});
  return notifications;
};

component.state.userAreasAccess = function() {
  var user;
  var relation;
  var organization;
  user = Meteor.user();
  relation = Relations.findOne({collectionName: 'users', entityId: user._id});
  organization = Organizations.findOne(relation.organizationId);
  return 'Organization: <b>'+organization.name+'</b>';
};

component.state.isAdmin = function() {
  var user = Meteor.user();
  if(user.isAdmin) {
    return true;
  } else {
    return false;
  }
};

component.state.belongToOrganization = function() {
  var userId = Meteor.userId();
  var relations = Relations.find({collectionName: "users", entityId: userId}).fetch();

  if(relations.length > 0) {
    return true;
  } else {
    return false;
  }
};

component.state.organizationId = function() {
  var userId = Meteor.userId();
  var relation = Relations.findOne({collectionName: 'users', entityId: userId});
  if(relation) {
    Session.set('organizationId', relation.organizationId);
    return relation.organizationId;
  } else {
    Session.set('organizationId', '');
    return false;
  }
};