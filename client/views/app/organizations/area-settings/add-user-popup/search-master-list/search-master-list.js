Template.searchMasterList.onCreated(function () {
  var options = {
    keepHistory: 1000 * 60 * 5
  };
  var fields = ['username'];
  this.UsersSearch = new SearchSource('usersSearch', fields, options);

  this.cleanHistoryAndSearch = function (text) {
    var selector = {
      isActive: true,
      areaId: this.areaId
    };
    this.UsersSearch.cleanHistory();
    this.UsersSearch.search(text, selector);
  };
});

Template.searchMasterList.helpers({
  searchUsers: function () {
    var tmpl = Template.instance();
    tmpl.cleanHistoryAndSearch(tmpl.searchText);
    return tmpl.UsersSearch.getData({
      sort: {'name': 1}
    });
  }
});