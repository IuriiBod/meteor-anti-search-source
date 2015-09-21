var component = FlowComponents.define('rolesList', function (props) {});

component.state.roles = function () {
  return Meteor.roles.find({}, {sort: {name: 1}}).fetch();
};