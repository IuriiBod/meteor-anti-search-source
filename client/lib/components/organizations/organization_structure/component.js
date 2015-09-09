var component = FlowComponents.define('organizationStructure', function(props) {
  var orgId = Session.get('organizationId');
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