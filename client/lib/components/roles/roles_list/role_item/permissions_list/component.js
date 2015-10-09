var component = FlowComponents.define('permissionsList', function (props) {
  this.set('role', props.role);
});

component.action.getRoleId = function () {
  return this.get('role')._id;
};