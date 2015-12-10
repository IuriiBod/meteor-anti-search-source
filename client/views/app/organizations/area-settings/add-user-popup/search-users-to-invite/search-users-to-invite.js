Template.searchUsersToInvite.onCreated(function () {
  var options = {
    keepHistory: 1000 * 60 * 5
  };
  var fields = ['username'];
  this.UserSearch = new SearchSource('usersSearch', fields, options);

  this.set('displaySearchResults', false);
  this.set('isNewUserAdding', false);

  this.setSearchAndInviteState = function (searchState, inviteState) {
    this.set('displaySearchResults', searchState);
    this.set('isNewUserAdding', inviteState);
  };
});

Template.searchUsersToInvite.helpers({
  searchedUsers: function () {
    return Template.instance().UserSearch.getData({});
  }
});

Template.searchUsersToInvite.events({
  'keyup input[name="addUserName"]': function (event, tmpl) {
    var searchText = $(event.target).val();
    if (searchText.length > 1) {
      // If search text is an email, display form for adding user name for a new user
      if (searchText.indexOf('@') > -1) {
        tmpl.setSearchAndInviteState(false, true);
      }
      // else search users depend on search text
      else {
        tmpl.setSearchAndInviteState(true, false);
        tmpl.UserSearch.search(searchText, {
          isActive: true,
          areaId: HospoHero.getCurrentAreaId()
        });
      }
    } else {
      tmpl.setSearchAndInviteState(true, false);
    }
  },

  'submit form': function (event, tmpl) {
    event.preventDefault();

    var data = HospoHero.misc.getValuesFromEvent(event, [
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

    data.areaId = tmpl.data.areaId;
    Meteor.call('createInvitation', data, HospoHero.handleMethodResult(function () {
      HospoHero.success('The user was notified');
      tmpl.$('input[name="addUserName"]').val('').focus();
      tmpl.setSearchAndInviteState(false, false);
    }));
  }
});