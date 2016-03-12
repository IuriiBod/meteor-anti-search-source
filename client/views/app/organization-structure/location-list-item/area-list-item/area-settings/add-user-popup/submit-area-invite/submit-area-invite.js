//context: email (string) or user (UserDocument)

Template.submitAreaInvite.events({
  'click .invite-user-button': function (event, tmpl) {
    let invitationMeta = {
      roleId: tmpl.$('[name="userRole"]').val(),
      areaId: tmpl.data.areaId
    };

    let currentUser = tmpl.data.user;

    if (currentUser) {
      invitationMeta.name = HospoHero.username(currentUser);
      invitationMeta.email = currentUser.emails[0].address;
    } else {
      invitationMeta.name = tmpl.$('.user-name-input').val();
      invitationMeta.email = tmpl.$('.user-search-input').val();
    }

    tmpl.isInviteInProgress.set(true);
    Meteor.call('inviteNewUserToArea', invitationMeta, HospoHero.handleMethodResult(() => {
      tmpl.isInviteInProgress.set(false);
      tmpl.data.onSubmitInviteClose();
      HospoHero.success('The user was notified');
    }));
  },
  
  'click .back-button': function (event, tmpl) {
    tmpl.data.onSubmitHook();
  }
});