Template.usersSearch.onCreated(function () {
  this.users = new ReactiveArray(this.data.selectedUsers);

  this.searchSource = this.AntiSearchSource({
    collection: 'users',
    fields: ['profile.firstname', 'profile.lastname', 'emails.address'],
    searchMode: 'global',
    limit: 15
  });

  this.autorun(() => {
    this.users.depend();
    this.searchSource.setMongoQuery({
      _id: {
        $nin: this.users.array()
      }
    });

    this.searchSource.search('');
  });
});


Template.usersSearch.onRendered(function () {
  this.$(".search-user-name").focus();
});


Template.usersSearch.helpers({
  searchResults () {
    return Template.instance().searchSource.searchResult({
      sort: {'profile.firstname': 1}
    });
  }
});


Template.usersSearch.events({
  'keyup .search-user-name' (event, tmpl) {
    let searchText = event.target.value;
    tmpl.searchSource.search(searchText);
  },

  'click .search-user-info-content' (event, tmpl) {
    if (_.isFunction(tmpl.data.onUserSelect)) {
      tmpl.$(".search-user-name").val('').focus();
      tmpl.data.onUserSelect(this.user._id);
      tmpl.users.push(this.user._id);
    }
  }
});