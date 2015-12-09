Template.searchUsersToInvite.onCreated(function () {
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

  this.set('searchText', '');
});

Template.searchUsersToInvite.helpers({
  searchedUsers: function () {
    console.log('TEST');

    var tmpl = Template.instance();
    var searchText = tmpl.get('searchText');

    if (searchText.length > 0) {
      tmpl.cleanHistoryAndSearch(searchText);
      return tmpl.UsersSearch.getData({
        sort: {'name': 1}
      });
    }
  }
});

Template.searchUsersToInvite.events({
  'keyup input[name="addUserName"]': function (event, tmpl) {
    var searchText = $(event.target).val();
    tmpl.set('searchText', searchText);
  }
});