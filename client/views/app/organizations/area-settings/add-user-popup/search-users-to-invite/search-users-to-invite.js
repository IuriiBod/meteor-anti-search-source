Template.searchUsersToInvite.onCreated(function () {
  this.subscribe('usersList');

  var selector = {
    _id: {$ne: Meteor.userId()},
    isActive: true
  };

  var area = HospoHero.getCurrentArea();
  selector['relations.areaIds'] = {$ne: area._id};

  this.searchSource = this.AntiSearchSource({
    collection: Meteor.users,
    fields: ['profile.firstname', 'profile.lastname', 'emails.address'],
    searchMode: 'local',
    mongoQuery: selector,
    limit: 10
  });

  this.usersCount = 0;

  this.set('displaySearchResults', false);
  this.set('isNewUserAdding', false);

  this.setSearchAndInviteState = function (searchState, inviteState) {
    this.set('displaySearchResults', searchState);
    this.set('isNewUserAdding', inviteState);
  };

  this.searchSource.search('');
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
    return Template.instance().get('isNewUserAdding');
  },
  displaySearchResults: function () {
    return Template.instance().get('displaySearchResults');
  }
});

Template.searchUsersToInvite.events({
  'keyup .add-user-name': function (event, tmpl) {
    var searchText = tmpl.$(event.target).val();

    if (searchText.length > 0) {
      // If search text is an email, display form for adding user name for a new user
      if (searchText.indexOf('@') > -1 && !tmpl.usersCount) {
        tmpl.setSearchAndInviteState(false, true);
      }
      // else search users depend on search text
      else {
        tmpl.setSearchAndInviteState(true, false);
        tmpl.searchSource.search(searchText);
      }
    } else {
      tmpl.setSearchAndInviteState(false, false);
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
      tmpl.setSearchAndInviteState(false, false);
    }));
  }
});