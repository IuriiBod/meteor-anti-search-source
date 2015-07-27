var component = FlowComponents.define("areaBox", function(props) {
  this.item = props.item;
  this.class = props.class;
});

component.state.item = function() {
  var area = this.item;
  area.class = this.class;
  return area;
}