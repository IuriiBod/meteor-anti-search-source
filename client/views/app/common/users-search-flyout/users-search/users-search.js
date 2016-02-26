Template.usersSearch.onCreated(function () {
  this.subscribe('usersList');

  let selector = {
    _id: {$ne: Meteor.userId()},
    isActive: true
  };

  this.searchSource = this.AntiSearchSource({
    collection: Meteor.users,
    fields: ['profile.firstname', 'profile.lastname', 'emails.address'],
    searchMode: 'global',
    mongoQuery: selector,
    limit: 15
  });

  this.autorun(() => {
    this.searchSource.setMongoQuery({
      _id: {
        $nin: this.data.selectedUsers
      }
    })
  });

  this.searchSource.search('');
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
    }
  }
});