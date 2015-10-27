var component = FlowComponents.define('permissionsChecklist', function (props) {});

component.state.actions = function () {
  return HospoHero.roles.getActions();
};