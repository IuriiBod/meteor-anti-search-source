var component = FlowComponents.define('locationSettings', function(props) {
  this.set('organizationId', props.organizationId);
  this.set('locationId', props.locationId);
});

component.state.location = function() {
  if(this.get('locationId')) {
    return Locations.findOne({_id: this.get('locationId')});
  }
};

component.action.deleteLocation = function(id) {
  Meteor.call('deleteLocation', id, function(err) {
    if(err) {
      HospoHero.error(err);
    }
  });
};