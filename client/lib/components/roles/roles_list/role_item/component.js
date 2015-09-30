var component = FlowComponents.define('roleItem', function (props) {
  this.set('role', props.role);
});

component.state.roleName = function () {
  return this.get('role').name;
};