Template.addUserPopup.onCreated(function () {
  this.selectedUser = new ReactiveVar(null);
  this.selectedEmail = new ReactiveVar(null);

  let selector = {
    _id: {$ne: Meteor.userId()},
    'relations.areaIds': {$ne: this.data.areaId}
  };

  this.searchSource = this.AntiSearchSource({
    collection: Meteor.users,
    fields: ['profile.firstname', 'profile.lastname', 'emails.address'],
    searchMode: 'global',
    mongoQuery: selector,
    limit: 10
  });

  this.focusOnSearchInput = () => this.$('input.user-search-input').focus();

  this.onSubmitInviteClose = () => {
    this.selectedUser.set(null);
    this.selectedEmail.set(false);

    this.focusOnSearchInput();
    this.$('input.user-search-input').val('');

    //refresh search to remove invited user from list
    this.searchSource.search('');
  };
});


Template.addUserPopup.onRendered(function () {
  this.focusOnSearchInput();
});


Template.addUserPopup.helpers({
  searchedUsers() {
    return Template.instance().searchSource.searchResult({
      sort: {'profile.firstname': 1}
    });
  },

  onUserSelect() {
    let tmpl = Template.instance();
    return function (user) {
      tmpl.selectedUser.set(user);
      tmpl.selectedEmail.set(null);
    };
  },

  submitInviteContext() {
    let tmpl = Template.instance();
    let user = tmpl.selectedUser.get();
    let email = tmpl.selectedEmail.get();
    return !!(user || email) && {
        user,
        email,
        areaId: this.areaId,
        onSubmitInviteClose: tmpl.onSubmitInviteClose
      };
  }
});

Template.addUserPopup.events({
  'keyup .user-search-input': _.throttle(function (event, tmpl) {
    let searchStr = $('.user-search-input').val();
    let emailRegExp = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;

    console.log('search', searchStr);

    if (emailRegExp.test(searchStr)) {
      tmpl.selectedEmail.set(searchStr);
      tmpl.selectedUser.set(null);
    } else {
      tmpl.searchSource.search(searchStr);
      tmpl.selectedEmail.set(false);
    }
  }, 300, {leading: false})
});