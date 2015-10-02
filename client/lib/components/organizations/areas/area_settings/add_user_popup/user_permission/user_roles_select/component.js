var component = FlowComponents.define('userRolesSelect', function (props) {});

component.state.userRoles = function() {
  return Roles.getRoles();
};