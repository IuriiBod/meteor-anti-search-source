Template.searchUsersToInvite.onCreated(function () {
  var selector = {
    _id: {$ne: Meteor.userId()},
    'relations.areaIds': {$ne: this.data.areaId}
  };

  this.searchSource = this.AntiSearchSource({
    collection: Meteor.users,
    fields: ['profile.firstname', 'profile.lastname', 'emails.address'],
    searchMode: 'local',
    mongoQuery: selector,
    limit: 10
  });

  this.usersCount = 0;

  this.searchText = new ReactiveVar('');
  this.isNewUserAdding = new ReactiveVar(false);
  this.isInviteInProgress = new ReactiveVar(false);
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
  isNewUserAdding: function () {
    return Template.instance().isNewUserAdding.get();
  },
  searchText: function () {
    return Template.instance().searchText.get();
  },
  isInviteInProgress: function () {
    return Template.instance().isInviteInProgress.get();
  }
});

Template.searchUsersToInvite.events({
  'keyup .add-user-name': function (event, tmpl) {
    var searchText = tmpl.$(event.target).val();
    tmpl.searchText.set(searchText);

    if (searchText.length > 0) {
      if (searchText.indexOf('@') > -1 && tmpl.usersCount === 0) {
        tmpl.isNewUserAdding.set(true);
      } else {
        tmpl.searchSource.search(searchText);
        tmpl.isNewUserAdding.set(false);
      }
    } else {
      tmpl.isNewUserAdding.set(false);
    }
  },

  'click .invite-user-button': function (event, tmpl) {
    var invitationMeta = {
      name: tmpl.$('.user-name-input').val(),
      email: tmpl.$('.add-user-name').val(),
      roleId: tmpl.$('[name="userRole"]').val(),
      areaId: tmpl.data.areaId
    };

    tmpl.isInviteInProgress.set(true);
    Meteor.call('inviteNewUserToArea', invitationMeta, HospoHero.handleMethodResult(function () {
      tmpl.$('input[name="addUserName"]').val('').focus();
      tmpl.searchText.set('');
      tmpl.isNewUserAdding.set(false);
      tmpl.isInviteInProgress.set(false);
      HospoHero.success('The user was notified');
    }));
  }
});