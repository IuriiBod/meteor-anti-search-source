var component = FlowComponents.define("createArea", function(props) {
  this.organizationId = props.organizationId;
  this.locationId = props.locationId;
});

component.state.locations = function() {
  return Locations.find({organizationId: this.organizationId}).fetch();
};

component.state.activeLocation = function(id) {
  if(this.locationId == id) {
    return true;
  } else {
    return false;
  }
};