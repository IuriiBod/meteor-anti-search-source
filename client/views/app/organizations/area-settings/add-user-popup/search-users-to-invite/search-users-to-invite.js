Template.searchUsersToInvite.onCreated(function () {
  this.subscribe('usersList');

  var selector = {
    _id: {$ne: Meteor.userId()},
    isActive: true,
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
});

Template.searchUsersToInvite.helpers({
  searchedUsers: function () {
    var users = Template.instance().searchSource.searchResult({
      sort: {'profile.firstname': 1}
    });
    
    Template.instance().usersCount = users.count();
    return users;
  },
  isNewUserAdding: function () {
    return Template.instance().isNewUserAdding.get();
  },
  displaySearchResults: function (searchedUsers) {
    return searchedUsers.count() > 0 && Template.instance().searchText.get().length > 0;
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

  'submit form': function (event, tmpl) {
    event.preventDefault();

    var invitationMeta = HospoHero.misc.getValuesFromEvent(event, [
      {
        name: 'addUserName',
        newName: 'email'
      },
      {
        name: 'newUserName',
        newName: 'name'
      }, {
        name: 'userRole',
        newName: 'roleId'
      }
    ], true);
    invitationMeta.areaId = tmpl.data.areaId;

    Meteor.call('inviteNewUserToArea', invitationMeta, HospoHero.handleMethodResult(function () {
      HospoHero.success('The user was notified');
      tmpl.$('input[name="addUserName"]').val('').focus();
      tmpl.isNewUserAdding.set(false);
      tmpl.searchText.set('');
    }));
  }
});