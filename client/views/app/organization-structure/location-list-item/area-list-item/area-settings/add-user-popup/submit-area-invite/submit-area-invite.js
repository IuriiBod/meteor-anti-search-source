//context: email (string) or user (UserDocument)
Template.submitAreaInvite.onCreated(function () {
  this.set('selectedUser', this.data.selectedUser);
});

Template.submitAreaInvite.helpers({
  onPermissionSelect: function () {
    var self = Template.instance();
    return function (selectedUserId) {
      self.selectedUser.set(selectedUserId);
    };
  }
});

Template.submitAreaInvite.events({
  'click .add-existing-user': function (event, tmpl) {
    var roleId = $('select[name="userRole"]').val();

    var addedUserInfo = {
      userId: tmpl.data.selectedUser,
      areaId: tmpl.data.areaId,
      roleId: roleId
    };

    Meteor.call('addUserToArea', addedUserInfo, HospoHero.handleMethodResult(function () {
      HospoHero.success('The user was notified');
      tmpl.data.onPermissionSelect(null);
    }));
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