Template.searchUsersToInvite.onCreated(function () {
  var selector = {
    _id: {$ne: Meteor.userId()},
    isActive: true
  };

  var area = HospoHero.getCurrentArea();
  selector['relations.organizationId'] = area.organizationId;
  selector['relations.areaIds'] = {$ne: area._id};

  this.searchSource = this.AntiSearchSource({
    collection: 'users',
    fields: ['profile.firstname', 'profile.lastname', 'emails.address'],
    searchMode: 'local',
    mongoQuery: selector,
    limit: 10
  });

  this.set('displaySearchResults', false);
  this.set('isNewUserAdding', false);

  this.setSearchAndInviteState = function (searchState, inviteState) {
    this.set('displaySearchResults', searchState);
    this.set('isNewUserAdding', inviteState);
  };
});

Template.searchUsersToInvite.helpers({
  searchedUsers: function () {
    return Template.instance().searchSource.searchResult({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>");
      },
      sort: {'profile.firstname': 1}
    })
  }
});

Template.searchUsersToInvite.events({
  'keyup input[name="addUserName"]': function (event, tmpl) {
    var searchText = tmpl.$(event.target).val();
    if (searchText.length > 1) {
      // If search text is an email, display form for adding user name for a new user
      if (searchText.indexOf('@') > -1) {
        tmpl.setSearchAndInviteState(false, true);
      }
      // else search users depend on search text
      else {
        tmpl.setSearchAndInviteState(true, false);
        tmpl.searchSource.search(searchText);
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