var component = FlowComponents.define('permissionsList', function (props) {
  this.set('role', props.role);
});

component.action.getRole = function () {
  return this.get('role');
};