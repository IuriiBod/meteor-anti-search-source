var component = FlowComponents.define("quantity", function (props) {
  this.id = props.id;
  this.type = props.type;
  this.quantity = props.quantity;
});

component.state.quantity = function () {
  return this.quantity;
};

component.action.getItem = function () {
  return {
    id: this.id,
    type: this.type
  }
};