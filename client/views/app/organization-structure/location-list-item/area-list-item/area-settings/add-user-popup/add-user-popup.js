Template.addUserPopup.onCreated(function () {
  this.selectedUser = new ReactiveVar(null);
  this.selectedEmail = new ReactiveVar(null);
  this.isInviteInProgress = new ReactiveVar(false);

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
});

Template.addUserPopup.onRendered(function () {
  this.$('input[name="addUserName"]').focus();
});

Template.addUserPopup.helpers({
  searchedUsers: function () {
    return Template.instance().searchSource.searchResult({
      sort: {'profile.firstname': 1}
    });
  },

  isInviteInProgress: function () {
    return Template.instance().isInviteInProgress.get();
  },

  onUserSelect: function () {
    let tmpl = Template.instance();
    return function (user) {
      tmpl.selectedUser.set(user);
      tmpl.selectedEmail.set(null);
    };
  },

  submitInviteContext: function () {
    let tmpl = Template.instance();
    let user = tmpl.selectedUser.get();
    let email = tmpl.selectedEmail.get();
    return !!(user || email) && {user, email};
  }
});

Template.addUserPopup.events({
  'click .search-user-info-content': function (event, tmpl) {
    tmpl.selectedUser.set(this._id);
  },

  'click .back-to-select-user': function (event, tmpl) {
    tmpl.$('input[name="addUserName"]').focus();
    tmpl.selectedUser.set(null);
  },

  'keyup .user-search-input': function (event, tmpl) {
    let searchStr = event.target.value;
    let emailRegExp = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;

    if (emailRegExp.test(searchStr)) {
      tmpl.selectedEmail.set(searchStr);
      tmpl.selectedUser.set(null);
    } else {
      tmpl.searchSource.search(searchStr);
      tmpl.selectedEmail.set(false);
    }
  }
});