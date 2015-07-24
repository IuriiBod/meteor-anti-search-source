var component = FlowComponents.define("areaItem", function(props) {
  this.item = props.item;
});

component.state.area = function() {
  return this.item;
}