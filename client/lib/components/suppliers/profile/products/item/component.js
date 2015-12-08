var component = FlowComponents.define("productItem", function (props) {
  this.item = props.item;
});

component.state.product = function () {
  return this.item;
}