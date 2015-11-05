var component = FlowComponents.define('posEditItem', function (props) {
  this.name = props.name;
});

component.state.getName = function(){
  return this.name;
};