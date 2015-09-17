var component = FlowComponents.define('searchMasterList', function (props) {
  var selector = {
    isActive: true,
    areaId: props.areaId
  };
  UsersSearch.search(props.searchText, selector);
});

var options = {
  keepHistory: 1000 * 60 * 5
};
var fields = ['username'];
UsersSearch = new SearchSource('usersSearch', fields, options);

component.state.searchUsers = function () {
  return UsersSearch.getData({
    sort: {'name': 1}
  });
};

component.state.hasResults = function () {
  return this.get('searchUsers').length > 0;
};