var component = FlowComponents.define('locationSettings', function(props) {
  this.set('locationId', props.locationId);
});

component.state.location = function() {
  if(this.get('locationId')) {
    return Locations.findOne({_id: this.get('locationId')});
  }
};

component.action.deleteLocation = function(id) {
  Meteor.call('deleteLocation', id, HospoHero.handleMethodResult());
};