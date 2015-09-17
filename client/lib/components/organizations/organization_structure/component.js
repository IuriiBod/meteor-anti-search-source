var component = FlowComponents.define('organizationStructure', function(props) {
  this.organization = props.organization;
  this.isOrganizationOwner = props.isOrganizationOwner;
  this.relation = props.relation;

  this.set('location', null);
  this.set('area', null);
});

component.state.organization = function() {
  return this.organization;
};

component.state.locations = function() {
  if(this.organization) {
    var selector = { organizationId: this.organization._id };
    if(this.relation.locationIds !== null) {
      selector._id = { $in: this.relation.locationIds };
    }
    return Locations.find(selector).fetch();
  }
};

component.state.areas = function(locationId) {
  if(this.organization) {
    var selector = { locationId: locationId };
    if(this.relation.areaIds !== null) {
      selector._id = { $in: this.relation.areaIds };
    }
    return Areas.find(selector).fetch();
  }
};

component.state.currentArea = function(id) {
  var currentArea = Session.get('currentAreaId');
  return (currentArea == id) ? true : false;
};

component.state.isOrganizationOwner = function() {
  return this.isOrganizationOwner;
};


component.action.changeLocation = function(id) {
  this.set('location', id);
};

component.action.changeArea = function(id) {
  this.set('area', id);
};