var component = FlowComponents.define('organizationStructure', function(props) {
  var userId = Meteor.userId();
  var rel = Relations.findOne({collectionName: "users", entityId: userId});
  var orgId = rel.organizationId;
  var org = Organizations.findOne(orgId);
  this.organization = org;
});

component.state.organization = function() {
  return this.organization;
};

component.state.locations = function() {
  return Locations.find({organizationId: this.organization._id}).fetch();
};

component.state.areas = function(locationId) {
  return Areas.find({locationId: locationId}).fetch();
};

component.state.currentArea = function(id) {
  var currentArea = Session.get('currentAreaId');
  return (currentArea == id) ? 'active' : '';
};