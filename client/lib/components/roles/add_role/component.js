var component = FlowComponents.define('addRole', function (props) {});

component.action.addRole = function (name, actions) {
  Meteor.call('addRole', name, actions, HospoHero.handleMethodResult(function(){}));
};