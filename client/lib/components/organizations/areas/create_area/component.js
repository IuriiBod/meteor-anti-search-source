var component = FlowComponents.define("createArea", function(props) {
  this.organizationId = props.organizationId;
  this.locationId = props.locationId;
  this.set('enabled', true);
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

component.action.changeEnabled = function() {
  this.set('enabled', !this.get('enabled'));
};

component.action.createArea = function (name, locationId, status) {
  // Find locations with the same name
  var count = Areas.find({locationId: locationId, name: name}).count();
  if(count > 0) {
    alert("The area with name " + name + " already exists!");
    return false;
  }

  var doc = {
    name: name,
    status: status,
    locationId: locationId,
    organizationId: this.organizationId
  };

  Meteor.call("createArea", doc, function (err) {
    if(err) {
      console.log(err);
      alert(err.reason);
    }
  });

  return true;
};