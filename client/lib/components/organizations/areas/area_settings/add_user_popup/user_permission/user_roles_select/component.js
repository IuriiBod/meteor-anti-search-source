var component = FlowComponents.define('userRolesSelect', function (props) {
});

component.state.userRoles = function () {
  return Meteor.roles.find({
    name: {
      $ne: 'Owner'
    }
  });
};