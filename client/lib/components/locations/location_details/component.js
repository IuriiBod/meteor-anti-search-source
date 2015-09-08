var component = FlowComponents.define("locationDetailsPage", function(props) {});

component.state.location = function() {
  var id = Router.current().params.id;
  return Locations.findOne({_id: id});
}

component.state.areas = function() {
  return Areas.find().fetch();
}