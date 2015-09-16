var component = FlowComponents.define('addUserPopup', function(props) {
  this.set('areaId', props.areaId);
  this.set('selectedUser', null);
  this.set('searchText', '');
});

component.state.inSearchMode = function() {
  return !this.get('selectedUser');
};

component.state.inviteNewUser = function() {
  var text = this.get('searchText');
  return text.indexOf('@') > -1;
};

component.state.isSearchEmpty = function() {
  var text = this.get('searchText');
  return text.length == 0;
};

component.action.onSearchTextChange = function(searchText) {
  this.set('searchText', searchText);
};

component.action.onUserSelect = function(userId) {
  this.set('selectedUser', userId);
};

component.action.clearSearchText = function() {
  this.set('searchText', '');
};