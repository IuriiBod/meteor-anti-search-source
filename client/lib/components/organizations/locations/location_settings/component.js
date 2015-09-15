var component = FlowComponents.define('locationSettings', function(props) {
  this.set('organizationId', props.organizationId);
  this.locationId = props.locationId;
});

component.state.location = function() {
  if(this.locationId) {
    return Locations.findOne({_id: this.locationId});
  }
};

component.action.deleteLocation = function(id) {
  Meteor.call('deleteLocation', id, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
};