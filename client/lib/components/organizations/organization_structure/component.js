var component = FlowComponents.define('organizationStructure', function(props) {
  this.set('location', null);
  this.set('area', null);
});

component.state.locations = function() {
  var selector = {};
  selector.organizationId = HospoHero.isInOrganization();
  var user = Meteor.user();
  if(user.relations && user.relations.locationIds) {
    selector._id = { $in: user.relations.locationIds };
  }
  return Locations.find(selector).fetch();
};

component.state.areas = function(locationId) {
  var selector = {};
  selector.organizationId = HospoHero.isInOrganization();
  var user = Meteor.user();
  if(user.relations && user.relations.areaIds) {
    selector._id = { $in: user.relations.areaIds };
  }
  return Areas.find(selector).fetch();
};

component.state.currentArea = function(id) {
  var currentArea = HospoHero.getCurrentArea();
  return currentArea._id == id;
};

component.action.changeLocation = function(id) {
  this.set('location', id);
};

component.action.changeArea = function(id) {
  this.set('area', id);
};

component.action.changeDefaultArea = function (areaId) {
  Meteor.call('changeDefaultArea', areaId, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
};