var component = FlowComponents.define("generalFlyout", function(props) {
  this.title = props.title;
  this.component = props.renderComponent;
});

component.state.title = function() {
  return this.title;
}

component.state.component = function() {
  return this.component;
}