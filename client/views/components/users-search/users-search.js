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
  },

  onUserSelect () {
    let userSearchTemplate = Template.instance();

    return (user) => {
      userSearchTemplate.$(".search-user-name").val('').focus();
      userSearchTemplate.data.onUserSelect(user._id);
      userSearchTemplate.users.push(user._id);
    };
  }
});


Template.usersSearch.events({
  'keyup .search-user-name' (event, tmpl) {
    let searchText = event.target.value;
    tmpl.searchSource.search(searchText);
  }
});