var component = FlowComponents.define("areaArchiveItem", function (props) {
  this.area = props.area;
});

component.state.getArea = function () {
  return this.area;
};

component.action.getArea = function () {
  return this.area;
}