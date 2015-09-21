var component = FlowComponents.define('roleItem', function (props) {
  this.set('role', props.role);
});

component.state.roleName = function () {
  var name = this.get('role').name;
  return name;
};