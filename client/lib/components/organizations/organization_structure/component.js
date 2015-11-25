var component = FlowComponents.define('organizationStructure', function(props) {
  this.set('location', null);
  this.set('area', null);
  this.set('organization', HospoHero.getOrganization());
});

component.state.locations = function() {
  if(this.get('organization')) {
    var selector = {
      organizationId: this.get('organization')._id,
      archived: {$ne:true}
    };

    if(!HospoHero.isOrganizationOwner()) {
      var user = Meteor.user();
      if(user.relations && user.relations.locationIds) {
        selector._id = { $in: user.relations.locationIds };
      }
    }

    return Locations.find(selector);
  }
};

component.state.hasLocations = function () {
  var locations = this.get('locations');
  return locations ? locations.count() : false;
};

component.state.areas = function(locationId) {
  var selector = {
    organizationId: this.get('organization')._id,
    locationId: locationId,
    archived: {$ne:true}
  };

  if(!HospoHero.isOrganizationOwner()) {
    var user = Meteor.user();
    if (user.relations && user.relations.areaIds) {
      selector._id = {$in: user.relations.areaIds};
    }
  }
  return Areas.find(selector);
};

component.state.currentArea = function(id) {
  var currentArea = HospoHero.getCurrentArea();
  return currentArea ? (currentArea._id == id) : null;
};

component.state.areaColor = function (areaId) {
  var area = Areas.findOne({ _id: areaId });
  if(area) {
    return area.color;
  }
};

component.action.changeLocation = function(id) {
  this.set('location', id);
};

component.action.changeArea = function(id) {
  this.set('area', id);
};

component.action.changeDefaultArea = function (areaId) {
  Meteor.call('changeDefaultArea', areaId, HospoHero.handleMethodResult());
};