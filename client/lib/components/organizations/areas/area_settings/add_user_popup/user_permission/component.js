var component = FlowComponents.define('userPermissions', function(props) {
  this.set('selectPermissions', props.selectPermissions);
  this.selectedUser = props.selectedUser;
  this.areaId = props.areaId;
});

component.action.addUser = function(roleId) {
  var addedUserInfo = {
    userId: this.selectedUser,
    areaId: this.areaId,
    roleId: roleId
  };

  Meteor.call('addUserToArea', addedUserInfo, HospoHero.handleMethodResult());
  this.set('selectPermissions', false);
};

component.action.backToSelectUser = function() {
  this.set('selectPermissions', false);
};