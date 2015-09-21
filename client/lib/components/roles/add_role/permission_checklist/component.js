var component = FlowComponents.define('permissionsChecklist', function (props) {});

component.state.permissions = function () {
  return Roles.getPermissions();
};