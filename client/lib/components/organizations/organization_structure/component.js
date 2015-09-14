var component = FlowComponents.define('organizationStructure', function(props) {
  var userId = Meteor.userId();
  var rel = Relations.findOne({collectionName: "users", entityId: userId});
  var orgId = rel.organizationId;
  var org = Organizations.findOne(orgId);
  this.organization = org;
  this.locations = rel.locationIds;
  this.areas = rel.areaIds;
});

component.state.organization = function() {
  return this.organization;
};

component.state.locations = function() {
  var selector = { organizationId: this.organization._id };
  if(this.locations !== null) {
    selector._id = { $in: this.locations };
  }
  return Locations.find(selector).fetch();
};

component.state.areas = function(locationId) {
  var selector = { locationId: locationId };
  if(this.areas !== null) {
    selector._id = { $in: this.areas };
  }
  return Areas.find(selector).fetch();
};

component.state.currentArea = function(id) {
  var currentArea = Session.get('currentAreaId');
  return (currentArea == id) ? 'active' : '';
};

component.state.isOwner = function() {
  var orgId = Session.get('organizationId');
  var userId = Meteor.userId();
  var count = Organizations.find({
    _id: orgId,
    owner: userId
  }).count();
  if(count > 0) {
    return true;
  } else {
    return false;
  }
};