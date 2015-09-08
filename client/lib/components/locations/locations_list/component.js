var component = FlowComponents.define("locationsListPage", function(props) {});

component.state.locations = function () {
  return locations = Locations.find().fetch();
}