Template.searchUsersToInvite.onCreated(function () {
  this.searchText = new ReactiveVar('');
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

  this.autorun(() => {
    let text = this.searchText.get();
    this.searchSource.search(text);
  });
});

Template.searchUsersToInvite.helpers({
  searchedUsers: function () {
    var users = Template.instance().searchSource.searchResult({
      sort: {'profile.firstname': 1}
    });

    if (users) {
      return users;
    }
  },
  selectedUser: function () {
    return Template.instance().selectedUser.get();
  },
  selectedEmail: function () {
    return Template.instance().selectedEmail.get();
  },
  searchText: function () {
    return Template.instance().searchText.get();
  },
  isInviteInProgress: function () {
    return Template.instance().isInviteInProgress.get();
  },
  selectUser: function () {
    let tmpl = Template.instance();
    return function (user) {
      tmpl.selectedUser.set(user);
      tmpl.selectedEmail.set(null);
      tmpl.searchText.set('');
    };
  },
  unselectUser: function () {
    let tmpl = Template.instance();
    return function () {
      tmpl.selectedUser.set(null);
    };
  },
  isReadyToInviteUser: function () {
    let tmpl = Template.instance();
    return !!tmpl.selectedEmail.get() || !!tmpl.selectedUser.get();
  }
});

Template.searchUsersToInvite.events({
  'keyup .user-search-input': function (event, tmpl) {
    let searchStr = event.target.value;
    let emailRegExp = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
    if (emailRegExp.test(searchStr)) {
      tmpl.selectedEmail.set(searchStr);
      tmpl.selectedUser.set(null);
    } else {
      tmpl.searchText.set(searchStr);
      tmpl.selectedEmail.set(false);
    }
  },

  'click .invite-user-button': function (event, tmpl) {
    let invitationMeta = {
      roleId: tmpl.$('[name="userRole"]').val(),
      areaId: tmpl.data.areaId
    };

    let currentUser = tmpl.selectedUser.get();

    if (currentUser) {
      invitationMeta.name = HospoHero.username(currentUser);
      invitationMeta.email = currentUser.emails[0].address;
    } else {
      invitationMeta.name = tmpl.$('.user-name-input').val();
      invitationMeta.email = tmpl.$('.user-search-input').val();
    }

    tmpl.isInviteInProgress.set(true);
    Meteor.call('inviteNewUserToArea', invitationMeta, HospoHero.handleMethodResult(function () {
      tmpl.$('input[name="addUserName"]').val('').focus();
      tmpl.searchText.set('');
      tmpl.selectedUser.set(null);
      tmpl.selectedEmail.set(null);
      tmpl.isInviteInProgress.set(false);
      HospoHero.success('The user was notified');
    }));
  }
});