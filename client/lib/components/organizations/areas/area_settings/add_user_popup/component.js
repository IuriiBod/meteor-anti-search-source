var component = FlowComponents.define('addUserPopup', function (props) {
  this.set('areaId', props.areaId);
  this.set('selectedUser', null);
  this.set('searchText', '');
  this.set('selectPermissions', true);
});

component.state.inSearchMode = function () {
  return !this.get('selectedUser');
};

component.state.inviteNewUser = function () {
  var text = this.get('searchText');
  return text.indexOf('@') > -1;
};

component.state.isSearchEmpty = function () {
  var text = this.get('searchText');
  return text.length == 0;
};

component.action.onSearchTextChange = function (searchText) {
  this.set('searchText', searchText);
};

component.action.onUserSelect = function (userId) {
  this.set('selectedUser', userId);
  this.set('selectPermissions', true);
};

component.action.clearSearchText = function () {
  this.set('searchText', '');
};

component.action.inviteNewUser = function (email, name, roleId) {
  var areaId = this.get('areaId');
  Meteor.call('createInvitation', email, name, areaId, roleId, HospoHero.handleMethodResult());
  this.set('selectedUser', '1');
  this.set('selectPermissions', false);
};