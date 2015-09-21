var component = FlowComponents.define('permissionsChecklist', function (props) {});

component.state.permissions = function () {
  console.log('PERM:', Roles.getPermissions());
  
  return Roles.getPermissions();
};