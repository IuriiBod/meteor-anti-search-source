var component = FlowComponents.define('permissionItem', function (props) {
  this.permission = props.permission;
});

component.state.permissionObject = function () {
  return Roles.getPermissionByKey(this.permission);
};