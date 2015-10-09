var component = FlowComponents.define('userPermissions', function(props) {
  this.set('selectPermissions', props.selectPermissions);
  this.selectedUser = props.selectedUser;
  this.areaId = props.areaId;
});

component.action.addUser = function(roleId) {
  var userId = this.selectedUser;
  var areaId = this.areaId;
  Meteor.call('addUserToArea', userId, areaId, roleId, function(err, area) {
    if(err) {
      HospoHero.alert(err);
    }
  });
  this.set('selectPermissions', false);
};

component.action.backToSelectUser = function() {
  this.set('selectPermissions', false);
};