var component = FlowComponents.define('locationSettings', function(props) {});

component.state.location = function() {
  var locId = Session.get('locationId');
  return Locations.findOne(locId);
}