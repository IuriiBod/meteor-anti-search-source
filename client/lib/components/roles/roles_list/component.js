var component = FlowComponents.define('rolesList', function (props) {});

component.state.roles = function () {
  return Roles.getRoles();
};