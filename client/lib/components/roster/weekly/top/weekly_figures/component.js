var component = FlowComponents.define("weeklyFigures", function(props) {
  this.week = props.week;
});

component.state.week = function() {
  return this.week;
}
