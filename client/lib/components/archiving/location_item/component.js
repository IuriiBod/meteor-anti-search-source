var component = FlowComponents.define("locationItem", function (props) {
  this.location = props.location;
});

component.state.getLocation = function () {
  return this.location;
};

component.state.isCurrentLocation = function (locationId) {
  return HospoHero.getCurrentArea().locationId === locationId
};

component.action.getLocation = function () {
  return this.location;
};