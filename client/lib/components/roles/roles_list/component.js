var component = FlowComponents.define('rolesList', function (props) {
});

component.state.roles = function () {
  return Meteor.roles.find();
};