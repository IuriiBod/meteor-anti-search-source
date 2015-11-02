var component = FlowComponents.define("locationAreaArchiving", function () {

});

component.state.locations = function () {
  return Locations.find();

};