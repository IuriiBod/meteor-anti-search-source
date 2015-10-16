var component = FlowComponents.define("createArea", function(props) {
  this.organizationId = props.organizationId;
  this.locationId = props.locationId;
  this.set('enabled', true);
});

component.state.locations = function() {
  var locations = Locations.find({organizationId: this.organizationId}).fetch();
  if(locations) {
    return _.map(locations, function(location) {
      return {value: location._id, text: location.name}
    });
  }
};

component.state.activeLocation = function(id) {
  return this.locationId == id;
};

component.action.changeEnabled = function() {
  this.set('enabled', !this.get('enabled'));
};

component.action.createArea = function (areaInfo) {
  areaInfo.organizationId = this.organizationId;

  Meteor.call("createArea", areaInfo, function (err) {
    if(err) {
      HospoHero.error(err);
    }
  });

  return true;
};