var component = FlowComponents.define('roleItem', function (props) {
  this.set('role', props.role);
});

component.action.getRole = function () {
  return this.get('role');
};

component.action.deleteRole = function () {
  Meteor.call('deleteRole', this.get('role')._id, HospoHero.handleMethodResult());
};